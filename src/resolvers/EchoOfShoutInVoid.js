//const { ensureAuthorized } = require('../utils');

//todo: create permissions for all individual resolvers

const createdBy = function(parent, args, context, info) {
    return context.prisma.echoOfShoutInVoid({ contentId: parent.contentId })
        .createdBy();
}
const originalShoutContent = function(parent, args, context, info) {
    return context.prisma.echoOfShoutInVoid({ contentId: parent.contentId })
        .originalShoutContent();
}
const originalShoutInVoid = function(parent, args, context, info) {
    return context.prisma.echoOfShoutInVoid({ contentId: parent.contentId })
        .originalShoutInVoid();
}
const originalEchoOfShoutInVoid = function(parent, args, context, info) {
    return context.prisma.echoOfShoutInVoid({ contentId: parent.contentId })
        .originalEchoOfShoutInVoid();
}
const nvoid = function(parent, args, context, info) {
    return context.prisma.echoOfShoutInVoid({ contentId: parent.contentId })
        .nvoid();
}
const echosOfEchos = function(parent, args, context, info) {
    return context.prisma.echoOfShoutInVoid({ contentId: parent.contentId })
        .echosOfEchos();
}
const replies = function(parent, args, context, info) {
    return context.prisma.echoOfShoutInVoid({ contentId: parent.contentId })
        .replies();
}

module.exports = {
    createdBy,
    originalShoutContent,
    originalShoutInVoid,
    originalEchoOfShoutInVoid,
    nvoid,
    echosOfEchos,
    replies,
};