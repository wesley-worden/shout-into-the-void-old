const { ensureAuthenticated, debug_settings } = require('./../utils');

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

module.exports = {
    getShitpost,
    getChannel,
    getUser
};