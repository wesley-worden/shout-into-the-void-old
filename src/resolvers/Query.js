const { ensureAuthorized, debug_settings, shoutIdIsPostedByUserId } = require('./../utils');

const getUser = async function(parent, args, context, info) {
    const userIdFromToken = ensureAuthorized(context);
    const user = await context.prisma.user({
        userId: args.userId
    });
    if(user.userId === userIdFromToken /* || isAdmin(userIdFromToken) */) {
        return user;
    } else {
        throw new Error("you are not authorized to view this user");
    }
};

const getShout = async function(parent, args, context, info) {
    return await context.prisma.shout({ shoutId: args.shoutId });
    const userIdFromToken = ensureAuthorized(context);
    const shout = await context.prisma.shout({ shoutId: args.shoutId });
    if(shoutIdIsPostedByUserId(context, shout.shoutId, userIdFromToken)) {
        return shout;
    } else {
        throw new Error("you are not the creator of this shout");
    }
}
/*
const getShitpost = async function(parent, args, context, info) {
    ensureAuthenticated(context);
    return await context.prisma.shitpost({
        shitpostId: args.shitpostId
    });
};

const getChannel = async function(parent, args, context, info) {
    ensureAuthenticated(context);
    return await context.prisma.channel({
        channelId: args.channelId
    });
};

const getUser = async function(parent, args, context, info) {
    ensureAuthenticated(context);
    return await context.prisma.user({
        userId: args.userId
    });
};
*/
module.exports = {
    getUser,
    getShout
    /*
    getShitpost,
    getChannel,
    getUser
    */
};