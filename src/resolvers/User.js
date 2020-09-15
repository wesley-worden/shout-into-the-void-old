//const { ensureAuthorized } = require('./../utils');
/*
const userRequestCanViewPrivateInfo = function(parent, context) {
    const userIdFromToken = ensureAuthorized(context);
    if(userIdFromToken === parent.userId) {
        return true;
    } else {
        return false;
    }
};
*/

//todo: create permissions for all individual user info
const currentLocation = function(parent, args, context, info) {
    return context.prisma.user({ userId: parent.userId })
        .currentLocation();
}
const createdContent = function(parent, args, context, info) {
    return context.prisma.user({ userId: parent.userId })
        .createdContent();
}
const createdVoids = function(parent, args, context, info) {
    return context.prisma.user({ userId: parent.userId })
        .createdVoids();
}
const savedVoids = function(parent, args, context, info) {
    return context.prisma.user({ userId: parent.userId })
        .savedVoids();
}
const createdShoutsInVoids = function(parent, args, context, info) {
    return context.prisma.user({ userId: parent.userId })
        .createdShoutsInVoids();
}
const activatedEchosOfShouts = function(parent, args, context, info) {
    return context.prisma.user({ userId: parent.userId })
        .activatedEchosOfShouts();
}
const createdEchosOfShoutsInVoid= function(parent, args, context, info) {
    return context.prisma.user({ userId: parent.userId })
        .createdEchosOfShoutsInVoid();
}
const repliesToShoutsInVoid = function(parent, args, context, info) {
    return context.prisma.user({ userId: parent.userId })
        .repliesToShoutsInVoid();
}
const repliesToEchosOfShoutsInVoid = function(parent, args, context, info) {
    return context.prisma.user({ userId: parent.userId })
        .repliesToEchosOfShoutsInVoid();
}

module.exports = {
    createdContent,
    currentLocation,
    createdVoids,
    savedVoids,
    createdShoutsInVoids,
    activatedEchosOfShouts,
    createdEchosOfShoutsInVoid,
    repliesToShoutsInVoid,
    repliesToEchosOfShoutsInVoid,
};