const { getUserId, shoutIdIsPostedByUserId, ensureAuthorized } = require('./../utils');

const userRequestCanViewPrivateInfo = function(parent, context) {
    const userIdFromToken = ensureAuthorized(context);
    if(userIdFromToken === parent.userId) {
        return true;
    } else {
        return false;
    }
};
const createdShouts = function(parent, args, context, info) {
    return context.prisma.user({ userId: parent.userId }).createdShouts();
    //only gives created shouts if logged in user matches parent user id
    if(userRequestCanViewPrivateInfo) { //todo: allow admin
        return context.prisma.user({ userId: parent.userId }).createdShouts();
    } else {
        throw new Error("You do not have access to this user info");
    }
};
const savedShouts = function(parent, args, context, info) {
    return context.prisma.user({ userId: parent.userId }).savedShouts();
    //only gives saved shouts if logged in user matches parent user id
    if(userRequestCanViewPrivateInfo) { //todo: allow admin
        return context.prisma.user({ userId: parent.userId }).savedShouts();
    } else {
        throw new Error("You do not have access to this user info");
    }
};
const echos = function(parent, args, context, info) {
    return context.prisma.user({ userId: parent.userId }).echos();
    //only gives echos if logged in user matches parent user id
    if(userRequestCanViewPrivateInfo) { //todo: allow admin
        return context.prisma.user({ userId: parent.userId }).echos();
    } else {
        throw new Error("You do not have access to this user info");
    }
};
const savedVoids = function(parent, args, context, info) {
    return context.prisma.user({ userId: parent.userId }).savedVoids();
    /*
    //only gives saved voids if logged in user matches parent user id
    if(userRequestCanViewPrivateInfo) { //todo: allow admin
        return context.prisma.user({ userId: parent.userId }).savedVoids();
    } else {
        throw new Error("You do not have access to this user info");
    }
    */
};
const currentLocationGeohash = function(parent, args, context, info) {
    return context.prisma.user({ userId: parent.userId }).currentLocationGeohash();
    //only gives location if logged in user matches parent user id
    if(userRequestCanViewPrivateInfo) { //todo: allow admin
        return context.prisma.user({ userId: parent.userId }).currentLocationGeohash();
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
    echos,
    savedVoids,
    currentLocationGeohash
    /*
    memberOfChannelEdges,
    ownerOfChannels
    */
};