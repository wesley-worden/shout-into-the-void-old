const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const utils = require('./../utils');
const config = require('./../../config.json');

const userModel = require('./../model/user');
const contentModel = require('./../model/content');
const nVoidModel = require('./../model/nVoid');
const shoutInVoidModel = require('./../model/shoutInVoid');
const voteBucketModel = require('./../model/voteBucket');
const voteModel = require('./../model/vote');

const login = async function(parent, args, context, info) {
    //get existing user from prisma database
    const { password, ...user } = await context.prisma.user({ username: args.username });
    if (!user) {
        throw new Error('No user found bruh');
    }
    //check if password is same ...same .. same password (same)
    const valid = await bcrypt.compare(args.password, password);
    if (!valid) {
        throw new Error('Invalid password');
    }
    const token = jwt.sign({ userId: user.userId }, config.APP_SECRET);
    if (config.debug_settings.log) {
        utils.showToken(token);
    }
    //return AuthPayload object according to schema
    return { token, user };
};

const signup = async function(parent, args, context, info) {
    const hashedPassword = await bcrypt.hash(args.password, 10); //todo: wait wut
    //bro whats destructuring
    const { password, ...user } = await context.prisma.createUser({ ...args, password: hashedPassword });
    const token = jwt.sign({ userId: user.userId }, config.APP_SECRET);
    // showMe(token);
    if (config.debug_settings.log) {
        console.log(`created user: ${user.userId}`);
        utils.showToken(token);
    }
    return { token, user }; // AuthPayload object
};

const updateLocation = async function(parent, args, context, info) {
    const userIdFromToken = await utils.ensureAuthorized(context);
    await userModel.utils.ensureUserExists(context, userIdFromToken);
    // check if geohash has enough precision
    await utils.ensureGeohashIsUserPrecision(args.geohash);
    // flatten geohash to user geohash precision
    const flattenedUserGeohash = utils.flattenGeohashToUserGeohash(args.geohash);
    // create UserLocation, connecting it to user thus updating locationHistory for User
    const createdUserLocation = await context.prisma.createUserLocation({
        userGeohash: flattenedUserGeohash,
        createdBy: {
            connect: {
                userId: userIdFromToken
            }
        }
    });
    // set connection for lastLocation for User
    const createdUserLocationId = createdUserLocation.userLocationId;
    const updatedUser = await context.prisma.updateUser({
        where: {
            userId: userIdFromToken
        },
        data: {
            lastLocation: {
                connect: {
                    userLocationId: createdUserLocationId
                }
            }
        }
    });
    // return updated User object
    // todo: should we return new UserLocation?
    return updatedUser;
};

const shoutIntoTheVoid = async function(parent, args, context, info) {
    const userIdFromToken = await utils.ensureAuthorized(context);
    await userModel.utils.ensureUserExists(context, userIdFromToken);
    // make sure that the last location for user is recent
    await userModel.utils.ensureLocationIsUpToDate(context, userIdFromToken);
    // get the users last location
    const userGeohash = await userModel.utils.getLastLocationUserGeohash(context, userIdFromToken);
    // flatten it to a void geohash
    const flattenedVoidGeohash = utils.flattenGeohashToVoidGeohash(userGeohash);
    // check if message is profane
    await contentModel.utils.ensureMessageIsNotProfane(args.message);
    // check if the void exists and if not create it
    const voidExists = await context.prisma.$exists.nVoid({
        voidGeohash: flattenedVoidGeohash
    });
    if(!voidExists) {
        const createdVoid = await context.prisma.createNVoid({
            createdBy: {
                connect: {
                    userId: userIdFromToken
                }
            },
            voidGeohash: flattenedVoidGeohash,
        });
    }
    // calculate the unique content message hash
    const uniqueContentMessageHash = await contentModel.utils.calculateUniqueContentMessageHash(args.message);
    // get voidId of existing NVoid from voidGeohash
    const voidId = await nVoidModel.utils.getVoidIdFromVoidGeohash(context, flattenedVoidGeohash);
    // create shout and connect it to a new void
    const createdShoutInVoid = await context.prisma.createShoutInVoid({
        createdBy: {
            connect: {
                userId: userIdFromToken
            }
        },
        content: {
            create: {
                createdBy: {
                    connect: {
                        userId: userIdFromToken
                    }
                },
                message: args.message
            }
        },
        uniqueContentMessageHash,
        nVoid: {
            connect: {
                voidId 
            }
        },
        voteBucket: {
            create: {
                voteCount: 0
            }
        }
    });
    return createdShoutInVoid;
    // todo handle cascade on delete for vote bucket and shit
};

const upvoteShout = async function(parent, args, context, info) {
    const userIdFromToken = await utils.ensureAuthorized(context);
    await userModel.utils.ensureUserExists(context, userIdFromToken);
    // make sure location is up to date
    await userModel.utils.ensureLocationIsUpToDate(context, userIdFromToken);
    // make sure shout exists
    await shoutInVoidModel.utils.ensureShoutExists(context, args.shoutInVoidId);
    // get vote bucket id
    const voteBucketId = await shoutInVoidModel.utils.getVoteBucketId(context, args.shoutInVoidId);
    // check if vote exists as upvote
    const upvoteHash = await voteModel.utils.calculateUniqueHash(userIdFromToken, voteBucketId, true);
    const upvoteExists = await context.prisma.$exists.vote({
        uniqueHash: upvoteHash
    });
    if(upvoteExists) {
        // do nothing
        console.log('helpmf');
        console.log(`voteBucketId: ${voteBucketId}`);
        // gtfo
        return await context.prisma.voteBucket({
            voteBucketId
        });
    } else {
        // get vote count, we will need it if downvote exists or creating upvote
        const currentVoteCount = await shoutInVoidModel.utils.getVoteCount(context, args.shoutInVoidId);
        // check if vote exists as downvote
        const downvoteHash = await voteModel.utils.calculateUniqueHash(userIdFromToken, voteBucketId, false);
        const downvoteExists = await context.prisma.$exists.vote({
            uniqueHash: downvoteHash
        });
        if(downvoteExists) {
            // change downvote to upvote and update vote count
            await context.prisma.updateVote({
                where: {
                    uniqueHash: downvoteHash
                },
                data: {
                    isUpvote: true,
                    uniqueHash: upvoteHash
                }
            });
            const updatedVoteBucket = await voteBucketModel.utils.updateVoteCount(context, voteBucketId, currentVoteCount + 2);
            return updatedVoteBucket;
        } else {
            // just create a new vote as upvote and update vote count
            console.log('creating vote');
            await context.prisma.createVote({
                createdBy: {
                    connect: {
                        userId: userIdFromToken
                    }
                },
                voteBucket: {
                    connect: {
                        voteBucketId: voteBucketId
                    }
                },
                isUpvote: true,
                uniqueHash: upvoteHash
            });
            const updatedVoteBucket = await voteBucketModel.utils.updateVoteCount(context, voteBucketId, currentVoteCount + 1);
            return updatedVoteBucket;
        }
    }
    
};
const downvoteShout = async function(parent, args, context, info) {
    const userIdFromToken = await utils.ensureAuthorized(context);
    await userModel.utils.ensureUserExists(context, userIdFromToken);
    // make sure location is up to date
    await userModel.utils.ensureLocationIsUpToDate(context, userIdFromToken);
    // make sure shout exists
    await shoutInVoidModel.utils.ensureShoutExists(context, args.shoutInVoidId);
    // get vote bucket id
    const voteBucketId = await shoutInVoidModel.utils.getVoteBucketId(context, args.shoutInVoidId);
    // check if vote exists as downvote
    const downvoteHash = await voteModel.utils.calculateUniqueHash(userIdFromToken, voteBucketId, false);
    const downvoteExists = await context.prisma.$exists.vote({
        uniqueHash: downvoteHash
    });
    if(downvoteExists) {
        // do nothing
        // gtfo
        return await context.prisma.voteBucket({
            voteBucketId
        });
    } else {
        // get vote count, we will need it if upvote exists or creating downvote
        const currentVoteCount = await shoutInVoidModel.utils.getVoteCount(context, args.shoutInVoidId);
        // check if we need to delete shout
        if(currentVoteCount == -4) {
            await context.prisma.deleteShoutInVoid({
                shoutInVoidId: args.shoutInVoidId
            });
            return null; //vote bucket should be deleted
            // todo: investigate cascade on delete for vote bucket and votes
        }

        // check if vote exists as upvote
        const upvoteHash = await voteModel.utils.calculateUniqueHash(userIdFromToken, voteBucketId, true);
        const upvoteExists = await context.prisma.$exists.vote({
            uniqueHash: upvoteHash
        });
        if(upvoteExists) {
            // change upvote to downvote and update vote count
            await context.prisma.updateVote({
                where: {
                    uniqueHash: upvoteHash
                },
                data: {
                    isUpvote: false,
                    uniqueHash: downvoteHash
                }
            });
            const updatedVoteBucket = await voteBucketModel.utils.updateVoteCount(context, voteBucketId, currentVoteCount - 2);
            return updatedVoteBucket;
        } else {
            // just create a new vote as downvote and update vote count
            await context.prisma.createVote({
                createdBy: {
                    connect: {
                        userId: userIdFromToken
                    }
                },
                voteBucket: {
                    connect: {
                        voteBucketId
                    }
                },
                isUpvote: false,
                uniqueHash: downvoteHash
            });
            const updatedVoteBucket = await voteBucketModel.utils.updateVoteCount(context, voteBucketId, currentVoteCount - 1);
            return updatedVoteBucket;
        }
    }
    
};

module.exports = {
    resolvers: {
        login,
        signup,
        updateLocation,
        shoutIntoTheVoid,
        upvoteShout, //todo: needs thoroughly tested
        downvoteShout, //todo needs tested badly
    }
};