const { ensureAuthorized } = require('../utils');

//todo: create permissions for all individual resolvers

const createdBy = function(parent, args, context, info) {
    return context.prisma.replyToShoutInVoid({ contentId: parent.contentId })
        .shoutedBy();
}
const content = function(parent, args, context, info) {
    return context.prisma.replyToShoutInVoid({ contentId: parent.contentId })
        .content();
}
const shoutInVoid = function(parent, args, context, info) {
    return context.prisma.replyToShoutInVoid({ contentId: parent.contentId })
        .shoutInVoid();
}
const savedReplies = function(parent, args, context, info) {
    return context.prisma.replyToShoutInVoid({ contentId: parent.contentId })
        .savedReplies();
}

module.exports = {
    createdBy,
    content,
    shoutInVoid,
    savedReplies
};