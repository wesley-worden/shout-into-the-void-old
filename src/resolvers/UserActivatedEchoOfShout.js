//const { ensureAuthorized } = require('../utils');

//todo: create permissions for all individual resolvers

const createdBy = function(parent, args, context, info) {
    return context.prisma.userActivatedEchoOfShout({ contentId: parent.contentId })
        .createdBy();
}
const originalShoutContent = function(parent, args, context, info) {
    return context.prisma.userActivatedEchoOfShout({ contentId: parent.contentId })
        .originalShoutContent();
}
const originalEchoOfShoutInVoid = function(parent, args, context, info) {
    return context.prisma.userActivatedEchoOfShout({ contentId: parent.contentId })
        .originalEchoOfShoutInVoid();
}
module.exports = {
    createdBy,
    originalShoutContent,
    originalEchoOfShoutInVoid
};