const { getUserId, shoutIdIsPostedByUserId } = require('./../utils');

const createdShouts = function(parent, args, context, info) {
    //only gives created shouts if logged in user matches parent user id
    const userIdFromToken = getUserId(context);
    const createdShouts = context.prisma.user({ userId: parent.userId }).createdShouts();
    if(userIdFromToken === parent.userId) { //todo: allow admin
        return createdShouts;
    } else {
        throw new Error("You do not have access to this user info");
    }
};
const savedShouts = function(parent, args, context, info) {
    //only gives saved shouts if loggin in user matches parent user id
    const userIdFromToken = getUserId(context);
    const savedShouts = context.prisma.user({ userId: parent.userId }).savedShouts();
    if(userIdFromToken === parent.userId) {
        return savedShouts;
    } else {
        throw new Error("You do not have access to this user info");
    }
};
/*
const memberOfChannelEdges = function(parent, args, context, info) {
    const memberOfChannelEdgesResult = context.prisma.user({ userId: parent.userId }).memberOfChannelEdges();
    console.log('memberOfChannelEdgesResult: ', memberOfChannelEdgesResult);
    return memberOfChannelEdgesResult;
}

const ownerOfChannels = function(parent, args, context, info) {
    const ownerOfChannelsResult = context.prisma.user({ userId: parent.userId }).ownerOfChannels();
    console.log('ownerOfChannelsResult', ownerOfChannelsResult);
    console.log('ownerOfChannelsResult.channelId', ownerOfChannelsResult.channelId);
    return ownerOfChannelsResult;
}
*/
module.exports = {
    createdShouts,
    savedShouts,
    //echoedShouts,
    //echoes,
    //savedVoids
    /*
    memberOfChannelEdges,
    ownerOfChannels
    */
};