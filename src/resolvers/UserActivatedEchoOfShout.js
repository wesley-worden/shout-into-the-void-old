//const { ensureAuthorized } = require('../utils');

//todo: create permissions for all individual resolvers

const createdBy = function(parent, args, context, info) {
    return context.prisma.userActivatedEchoOfShout({ userActivatedEchoOfShoutId: parent.userActivatedEchoOfShoutId })
        .createdBy();
}
const originalShoutContent = function(parent, args, context, info) {
    return context.prisma.userActivatedEchoOfShout({ userActivatedEchoOfShoutId: parent.userActivatedEchoOfShoutId })
        .originalShoutContent();
}
const originalEchoOfShoutInVoid = function(parent, args, context, info) {
    return context.prisma.userActivatedEchoOfShout({ userActivatedEchoOfShoutId: parent.userActivatedEchoOfShoutId })
        .originalEchoOfShoutInVoid();
}
module.exports = {
    createdBy,
    originalShoutContent,
    originalEchoOfShoutInVoid
};