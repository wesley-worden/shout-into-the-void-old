const { ensureAuthorized } = require('./../utils');

const userRequestCanViewPrivateInfo = function(parent, context) {
    const userIdFromToken = ensureAuthorized(context);
    if(userIdFromToken === parent.userId) {
        return true;
    } else {
        return false;
    }
};

//todo: create permissions for all individual user info

const shoutsInVoids = function(parent, args, context, info) {
    return context.prisma.user({ contentId: parent.contentId })
        .shoutsInVoids();
}
const savedShouts = function(parent, args, context, info) {
    return context.prisma.user({ contentId: parent.contentId })
        .savedShouts();
}
const echosInVoids = function(parent, args, context, info) {
    return context.prisma.user({ contentId: parent.contentId })
        .echosInVoids();
}
const savedEchos = function(parent, args, context, info) {
    return context.prisma.user({ contentId: parent.contentId })
        .savedEchos();
}
const repliesToShoutsInVoids = function(parent, args, context, info) {
    return context.prisma.user({ contentId: parent.contentId })
        .repliesToShoutsInVoids();
}
const savedRepliesToShoutsInVoids= function(parent, args, context, info) {
    return context.prisma.user({ contentId: parent.contentId })
        .savedRepliesToShoutsInVoids();
}
const repliesToEchosInVoids = function(parent, args, context, info) {
    return context.prisma.user({ contentId: parent.contentId })
        .repliesToEchosInVoids();
}
const savedRepliesToEchosInVoids = function(parent, args, context, info) {
    return context.prisma.user({ contentId: parent.contentId })
        .savedRepliesToEchosInVoids();
}
const createdVoids = function(parent, args, context, info) {
    return context.prisma.user({ contentId: parent.contentId })
        .createdVoids();
}
const savedVoids = function(parent, args, context, info) {
    return context.prisma.user({ contentId: parent.contentId })
        .savedVoids();
}

module.exports = {
    shoutsInVoids,
    savedShouts,
    echosInVoids,
    savedEchos,
    repliesToShoutsInVoids,
    savedRepliesToShoutsInVoids,
    repliesToEchosInVoids,
    savedRepliesToEchosInVoids,
    createdVoids,
    savedVoids
};