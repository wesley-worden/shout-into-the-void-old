//const { ensureAuthorized } = require('../utils');

//todo: create permissions for all individual resolvers

const createdBy = function(parent, args, context, info) {
    return context.prisma.replyToShoutInVoid({ contentId: parent.contentId })
        .shoutedBy();
}
const content = function(parent, args, context, info) {
    return context.prisma.replyToShoutInVoid({ contentId: parent.contentId })
        .content();
}
const originalShoutInVoid = function(parent, args, context, info) {
    return context.prisma.replyToShoutInVoid({ contentId: parent.contentId })
        .shoutInVoid();
}

module.exports = {
    createdBy,
    content,
    originalShoutInVoid
};