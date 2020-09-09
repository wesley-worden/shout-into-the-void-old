const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { 
    APP_SECRET, 
    //VOID_GEOHASH_PRECISION, 
    //getVoteCountForShoutId,
    //showMe, 
    //getCurrentLocationGeohashForUserId, 
    //getClosestVoidGeohashForUserId, 
    //createVoid, 
    //voidExists, 
    showToken, 
    //getUserId, 
    ensureAuthorized, 
    /*
    ensureUserExists, 
    ensureChannelExists, 
    ensureShitpostExists, 
    ensureUserIsChannelOwner, 
    getChannelMembers, 
    */
    flattenGeohashToUserGeohash, 
    /*
    getRepliesIdsToShoutId, 
    getVoidIdFromShoutId, 
    getShoutCreatedAt, 
    getShoutContent, 
    shoutIdIsPostedByUserId, 
    getVoidGeohashFromVoidId 
    */
} = require('./../utils');
const { debug_settings } = require('./../../config.json');
const clipboardy = require('clipboardy');

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
    const token = jwt.sign({ userId: user.userId }, APP_SECRET);
    if (debug_settings.log) {
        showToken(token);
    }
    //return AuthPayload object according to schema
    return { token, user };
};
const signup = async function(parent, args, context, info) {
    const hashedPassword = await bcrypt.hash(args.password, 10); //todo: wait wut
    //bro whats destructuring
    const { password, ...user } = await context.prisma.createUser({ ...args, password: hashedPassword });
    const token = jwt.sign({ userId: user.userId }, APP_SECRET);
    // showMe(token);
    if (debug_settings.log) {
        console.log(`created user: ${user.userId}`);
        showToken(token);
    }
    return { token, user }; // AuthPayload object
};
const updateLocation = async function(parent, args, context, info) {
    const userIdFromToken = ensureAuthorized(context);
    // todo: flatten geohash to user geohash
    //const flattenedGeohash = flattenGeohashToUserGeohash(args.currentLocationGeohash);
    const flattenedGeohash = args.currentLocationGeohash;
    const updatedUser = await context.prisma.updateUser({
        where: { userId: userIdFromToken },
        data: { currentLocationGeohash: flattenedGeohash }
    });
    return updatedUser;
};
/*
const upvoteReply = async function(parent, args, context, info) {
    const userIdFromToken = ensureAuthorized(context);
    const newVoteCount = await getVoteCountForReplyId(context, args.replyId) + 1;
    const updatedReply = await context.prisma.updateReply({
        where: { replyId: args.replyId },
        data: { voteCount: newVoteCount }
    });
    return updatedReply;
};
const upvoteShout = async function(parent, args, context, info) {
    const userIdFromToken = ensureAuthorized(context);
    const newVoteCount = await getVoteCountForShoutId(context, args.shoutId) + 1;
    const updatedShout = await context.prisma.updateShout({
        where: { shoutId: args.shoutId },
        data: { voteCount: newVoteCount }
    });
    return updatedShout;
};
const downvoteReply = async function(parent, args, context, info) {
    const userIdFromToken = ensureAuthorized(context);
    const newVoteCount = await getVoteCountForReplyId(context, args.replyId) - 1;
    if(newVoteCount <= -4) {
        //delete reply
        const deletedReply = await context.prisma.deleteReply({ replyId: args.replyId });
        return deletedReply;
    } else {
        const updatedReply = await context.prisma.updateReply({
            where: { connect: { replyId: args.replyId }},
            data: { voteCount: newVoteCount }
        });
        return updatedReply;
    }
};
const downvoteShout = async function(parent, args, context, info) {
    const userIdFromToken = ensureAuthorized(context);
    const newVoteCount = await getVoteCountForShoutId(context, args.shoutId) - 1;
    if(newVoteCount <= -4) { //todo this prolly doesnt work
        //delete shout, delete replies
        const deletedShout = await context.prisma.deleteShout({
            shoutId: args.shoutId
        });
        const shoutRepliesIds = getRepliesIdsToShoutId(context, args.shoutId);
        shoutRepliesIds.forEach(replyId => {
            const deletedReply = await context.prisma.deleteReply({
                replyId: replyId
            });
        });
        return deletedShout;
    } else {
        const updatedShout = await context.prisma.updateShout({
            where: { shoutId: args.shoutId },
            data: { voteCount: newVoteCount }
        });
    }
    return updatedShout;
};
const reply = async function(parent, args, context, info) {
    const userIdFromToken = ensureAuthorized(context);
    //lot didnt need it
    //const shoutVoidId = await getVoidIdFromShoutId(context, userIdFromToken, args.shoutId);
    const createdReply = await context.prisma.createReply({
        originalShout: { connect: { shoutId: args.shoutId }},
        voteCount: 1,
        content: args.content,
        postedBy: { connect: { userId: userIdFromToken }}
    });
    return createdReply;
};
const saveShout = async function(parent, args, context, info) {
    const userIdFromToken = ensureAuthorized(context);
    const shoutCreatedAt = getShoutCreatedAt(context, args.shoutId);
    const shoutContent = getShoutContent(context, args.shoutId);
    const shoutPostedByUserId = shoutIdIsPostedByUserId(context, args.shoutId);
    const shoutOriginalVoidId = getVoidIdFromShoutId(context, args.shoutId);
    const shoutOriginalVoidGeohash = getVoidGeohashFromVoidId(context, shoutOriginalVoidId);
    const createdSavedShout = await context.prisma.createSavedShout({
        originalShout: { connect: { shoutId: args.shoutId }},
        savedShoutId: args.shoutId,
        originalShoutCreatedAt: shoutCreatedAt,
        originalContent: shoutContent,
        originalPostedBy:  { connect: { userId: shoutPostedByUserId }},
        originalVoid: { connect: { voidId: shoutOriginalVoidId }},
        originalVoidGeohash: shoutOriginalVoidGeohash
    });
    return createdSavedShout;
};
const shout = async function(parent, args, context, info) {
    const userIdFromToken = ensureAuthorized(context);
    //todo: content filter
    const closestVoidGeohash = await getClosestVoidGeohashForUserId(context, userIdFromToken);
    console.log(`using closestVoidGeohash: ${closestVoidGeohash}`);
    //if(!context.prisma.$exists.nVoid({ geohash: closestVoidGeohash })) {
    const exists = await voidExists(context, closestVoidGeohash);
    if(!exists) {
        console.log(`trying to create void`);
        await createVoid(context, closestVoidGeohash, userIdFromToken);
    }
    const createdShout = await context.prisma.createShout({
        voteCount: 1,
        content: args.content,
        postedBy: { 
            connect: { userId: userIdFromToken }
        },
        nvoid: {
            connect: { geohash: closestVoidGeohash }
        }
    });
    return createdShout;
};
*/
/*
const createChannel = async function(parent, args, context, info) {
    const userId = getUserId(context);
    const createdChannel = await context.prisma.createChannel({
        name: args.name,
        owner: {
            connect: {
                userId: userId
            }
        },
        // memberEdges: []
    });
    return createdChannel;
};

const addMember = async function(parent, args, context, info) {
    const channelId = args.channelId;
    const userId = getUserId(context);
    const memberUserId = args.memberUserId;
    await ensureChannelExists(context, channelId);
    await ensureUserIsChannelOwner(context, userId, channelId);
    await ensureUserExists(context, memberUserId);
    const user = await context.prisma.user({
        userId: memberUserId
    });
    // const otherUser = await context.prisma.user({
    //     userId: parent.userId
    // });
    const memberChannelEdges = await context.prisma.user({
        userId: memberUserId
    }).memberOfChannelEdges();
    let wackyWavyMembersArray;
    console.log("memberChannelEdges: ", memberChannelEdges);
    if (memberChannelEdges.length !== 0) {
        console.log('doin bad things')
        wackyWavyMembersArray = memberChannelEdges.map(function(edge) {
            return {
                connect: {
                    edgeId: edge.edgeId
                }
            }
            // return {
            //     connect: edge.edgeId
            // }
        });
    } else {
        console.log('doin good things')
        const createdEdge = context.prisma.createEdge( {
            connect: {
                userId: memberUserId
            },
            connect: {
                channelId: channelId
            }
        });
        console.log("createdEdge: ", createdEdge);
        wackyWavyMembersArray = [{
            connect: createdEdge.edgeId
        }];
    }
    const updatedUser = await context.prisma.updateUser({
        data: {
            memberOfChannelEdges: wackyWavyMembersArray
        },
        where: {
            userId: userId
        }
    });
    if (debug_settings.log) {
        console.log("user: ", user);
        // console.log("user: ", otherUser);
        console.log("user.memberOfChannelEdges: ", memberOfChannels);
    }
   return updatedUser; 
}

const shitpost = async function(parent, args, context, info) {
    const userId = getUserId(context);
    await ensureChannelExists(context, args.channelId); //untested
    const createdShitpost = context.prisma.createShitpost({
        postedBy: {
            connect: {
                userId: userId 
            }
        },
        encryptedContent: args.encryptedContent,
        channel: {
            connect: {
                channelId: args.channelId
            }
        }
    });
    return createdShitpost;
};

const deleteShitpost = async function(parent, args, context, info) {
    const userId = getUserId(context);
    ensureShitpostExists(context, args.shitpostId); //todo: is this needed?
    return await context.prisma.deleteShitpost({ 
        shitpostId: args.shitpostId 
    });
};

// const removeMembers = f
//todo: help

const deleteChannel = async function(parent, args, context, info) {
    const userId = getUserId(context);
    await ensureChannelExists(context, args.channelId);
    return await context.prisma.deleteChannel({ 
        shitpostId: args.shitpostId 
    });
};
*/
module.exports = { 
    login,
    signup,
    updateLocation,
    /*upvoteShout,
    downvoteShout,
    shout,
    reply,
    upvoteReply,
    downvoteReply,
    saveShout,
    saveVoid,
    echo,*/
    //createChannel,
    //addMember,
    //shitpost,
    //deleteShitpost,
    // removeMember,
    //deleteChannel
};