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

const createdContent = function(parent, args, context, info) {
    return context.prisma.user({ contentId: parent.contentId })
        .createdContent();
}
const createdVoids = function(parent, args, context, info) {
    return context.prisma.user({ contentId: parent.contentId })
        .createdVoids();
}
const savedVoids = function(parent, args, context, info) {
    return context.prisma.user({ contentId: parent.contentId })
        .savedVoids();
}
const createdShoutsInVoids = function(parent, args, context, info) {
    return context.prisma.user({ contentId: parent.contentId })
        .createdShoutsInVoids();
}
const activatedEchosOfShouts = function(parent, args, context, info) {
    return context.prisma.user({ contentId: parent.contentId })
        .activatedEchosOfShouts();
}
const createdEchosOfShoutsInVoid= function(parent, args, context, info) {
    return context.prisma.user({ contentId: parent.contentId })
        .createdEchosOfShoutsInVoid();
}
const repliesToShoutsInVoid = function(parent, args, context, info) {
    return context.prisma.user({ contentId: parent.contentId })
        .repliesToShoutsInVoid();
}
const repliesToEchosOfShoutsInVoid = function(parent, args, context, info) {
    return context.prisma.user({ contentId: parent.contentId })
        .repliesToEchosOfShoutsInVoid();
}

module.exports = {
    createdContent,
    createdVoids,
    savedVoids,
    createdShoutsInVoids,
    activatedEchosOfShouts,
    createdEchosOfShoutsInVoid,
    repliesToShoutsInVoid,
    repliesToEchosOfShoutsInVoid,
};