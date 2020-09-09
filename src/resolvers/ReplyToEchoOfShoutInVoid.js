//const { ensureAuthorized } = require('../utils');

//todo: create permissions for all individual resolvers

const createdBy = function(parent, args, context, info) {
    return context.prisma.replyToEchoOfShoutInVoid({ contentId: parent.contentId })
        .createdBy();
}
const content = function(parent, args, context, info) {
    return context.prisma.replyToEchoOfShoutInVoid({ contentId: parent.contentId })
        .content();
}
const originalEchoOfShoutInVoid = function(parent, args, context, info) {
    return context.prisma.replyToEchoOfShoutInVoid({ contentId: parent.contentId })
        .originalEchoOfShoutInVoid();
}

module.exports = {
    createdBy,
    content,
    originalEchoOfShoutInVoid
};