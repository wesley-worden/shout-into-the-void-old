const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, showMe, showToken, getUserId, ensureUserExists, ensureChannelExists, ensureShitpostExists, ensureUserIsChannelOwner, getChannelMembers } = require('./../utils');
const { debug_settings } = require('./../../config.json');
const clipboardy = require('clipboardy');

const login = async function(parent, args, context, info) {
    //get existing user from prisma database
    const { password, ...user } = await context.prisma.user({ email: args.email });
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
    const hashedPassword = await bcrypt.hash(args.password, 10)
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

module.exports = { 
    login,
    signup,
    createChannel,
    addMember,
    shitpost,
    deleteShitpost,
    // removeMember,
    deleteChannel
};