const { ensureAuthorized } = require('../utils');

//todo: create permissions for all individual resolvers

const savedBy = function(parent, args, context, info) {
    return context.prisma.replyToShoutInVoid({ contentId: parent.contentId })
        .shoutedBy();
}
const originalReplyContent = function(parent, args, context, info) {
    return context.prisma.replyToShoutInVoid({ contentId: parent.contentId })
        .originalReplyContent();
}
const originalShoutContent = function(parent, args, context, info) {
    return context.prisma.replyToShoutInVoid({ contentId: parent.contentId })
        .originalShoutContent();
}
const replyToEchoInVoid = function(parent, args, context, info) {
    return context.prisma.replyToShoutInVoid({ contentId: parent.contentId })
        .shoutInVoid();
}

module.exports = {
    savedBy,
    originalReplyContent,
    originalShoutContent,
    replyToEchoInVoid
};