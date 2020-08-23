const { ensureAuthorized } = require('../utils');

//todo: create permissions for all individual resolvers

const savedBy = function(parent, args, context, info) {
    return context.prisma.savedEcho({ contentId: parent.contentId })
        .savedBy();
}
const originalContent = function(parent, args, context, info) {
    return context.prisma.savedEcho({ contentId: parent.contentId })
        .originalContent();
}
const echoInVoid = function(parent, args, context, info) {
    return context.prisma.savedEcho({ contentId: parent.contentId })
        .echoInVoid();
}
const echoEdges = function(parent, args, context, info) {
    return context.prisma.savedEcho({ contentId: parent.contentId })
        .echoEdges();
}

module.exports = {
    savedBy,
    originalContent,
    echoInVoid,
    echoEdges
};