const { ensureAuthorized } = require('../utils');

//todo: create permissions for all individual resolvers

const savedBy = function(parent, args, context, info) {
    return context.prisma.savedReplyToShoutInVoid({ contentId: parent.contentId })
        .savedBy();
}
const originalReplyContent = function(parent, args, context, info) {
    return context.prisma.savedReplyToShoutInVoid({ contentId: parent.contentId })
        .originalReplyContent();
}
const originalShoutContent = function(parent, args, context, info) {
    return context.prisma.savedReplyToShoutInVoid({ contentId: parent.contentId })
        .originalShoutContent();
}
const replyToShoutInVoid = function(parent, args, context, info) {
    return context.prisma.savedReplyToShoutInVoid({ contentId: parent.contentId })
        .replyToShoutInVoid();
}

module.exports = {
    savedBy,
    originalReplyContent,
    originalShoutContent,
    replyToShoutInVoid,
};