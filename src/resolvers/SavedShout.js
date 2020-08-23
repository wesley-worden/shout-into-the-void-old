const { ensureAuthorized } = require('./../utils');

//todo: create permissions for all individual resolvers

const savedBy = function(parent, args, context, info) {
    return context.prisma.savedShout({ contentId: parent.contentId })
        .savedBy();
}
const originalContent = function(parent, args, context, info) {
    return context.prisma.savedShout({ contentId: parent.contentId })
        .originalContent();
}
const shoutInVoid = function(parent, args, context, info) {
    return context.prisma.savedShout({ contentId: parent.contentId })
        .shoutInVoid();
}
const echoEdges = function(parent, args, context, info) {
    return context.prisma.savedShout({ contentId: parent.contentId })
        .echoEdges();
}

module.exports = {
    savedBy,
    originalContent,
    shoutInVoid,
    echoEdges
};