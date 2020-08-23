const { ensureAuthorized } = require('./../utils');

//todo: create permissions for all individual resolvers

const createdBy = function(parent, args, context, info) {
    return context.prisma.replyToShoutInVoid({ contentId: parent.contentId })
        .createdBy();
}
const content = function(parent, args, context, info) {
    return context.prisma.replyToShoutInVoid({ contentId: parent.contentId })
        .content();
}
const echoInVoid = function(parent, args, context, info) {
    return context.prisma.replyToShoutInVoid({ contentId: parent.contentId })
        .echoInVoid();
}
const savedReplies = function(parent, args, context, info) {
    return context.prisma.replyToShoutInVoid({ contentId: parent.contentId })
        .savedReplies();
}

module.exports = {
    createdBy,
    content,
    echoInVoid,
    savedReplies
};