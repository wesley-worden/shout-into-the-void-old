const { ensureAuthorized } = require('./../utils');

//todo: create permissions for all individual resolvers

const echoedBy = function(parent, args, context, info) {
    return context.prisma.echoInVoid({ contentId: parent.contentId })
        .echoedBy();
}
const originalContent = function(parent, args, context, info) {
    return context.prisma.echoInVoid({ contentId: parent.contentId })
        .originalContent();
}
const nvoid = function(parent, args, context, info) {
    return context.prisma.echoInVoid({ contentId: parent.contentId })
        .nvoid();
}
const savedEchos = function(parent, args, context, info) {
    return context.prisma.echoInVoid({ contentId: parent.contentId })
        .savedEchos();
}
const replies = function(parent, args, context, info) {
    return context.prisma.echoInVoid({ contentId: parent.contentId })
        .replies();
}
const echoEdge = function(parent, args, context, info) {
    return context.prisma.echoInVoid({ contentId: parent.contentId })
        .echoEdge();
}

module.exports = {
    echoedBy,
    originalContent,
    nvoid,
    savedEchos,
    replies,
    echoEdge
};