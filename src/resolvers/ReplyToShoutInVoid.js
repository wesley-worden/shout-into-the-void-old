//const { ensureAuthorized } = require('../utils');

//todo: create permissions for all individual resolvers

const createdBy = function(parent, args, context, info) {
    return context.prisma.replyToShoutInVoid({ replyToShoutInVoidId: parent.replyToShoutInVoidId })
        .shoutedBy();
}
const content = function(parent, args, context, info) {
    return context.prisma.replyToShoutInVoid({ replyToShoutInVoidId: parent.replyToShoutInVoidId })
        .content();
}
const originalShoutInVoid = function(parent, args, context, info) {
    return context.prisma.replyToShoutInVoid({ replyToShoutInVoidId: parent.replyToShoutInVoidId })
        .shoutInVoid();
}

module.exports = {
    createdBy,
    content,
    originalShoutInVoid
};