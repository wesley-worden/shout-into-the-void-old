//const { ensureAuthorized } = require('../utils');

//todo: create permissions for all individual resolvers

const createdBy = function(parent, args, context, info) {
    return context.prisma.echoOfShoutInVoid({ echoOfShoutInVoidId: parent.echoOfShoutInVoidId })
        .createdBy();
}
const originalShoutContent = function(parent, args, context, info) {
    return context.prisma.echoOfShoutInVoid({ echoOfShoutInVoidId: parent.echoOfShoutInVoidId })
        .originalShoutContent();
}
const originalShoutInVoid = function(parent, args, context, info) {
    return context.prisma.echoOfShoutInVoid({ echoOfShoutInVoidId: parent.echoOfShoutInVoidId })
        .originalShoutInVoid();
}
const originalEchoOfShoutInVoid = function(parent, args, context, info) {
    return context.prisma.echoOfShoutInVoid({ echoOfShoutInVoidId: parent.echoOfShoutInVoidId })
        .originalEchoOfShoutInVoid();
}
const nVoid = function(parent, args, context, info) {
    return context.prisma.echoOfShoutInVoid({ echoOfShoutInVoidId: parent.echoOfShoutInVoidId })
        .nVoid();
}
const echosOfEchos = function(parent, args, context, info) {
    return context.prisma.echoOfShoutInVoid({ echoOfShoutInVoidId: parent.echoOfShoutInVoidId })
        .echosOfEchos();
}
const replies = function(parent, args, context, info) {
    return context.prisma.echoOfShoutInVoid({ echoOfShoutInVoidId: parent.echoOfShoutInVoidId })
        .replies();
}

module.exports = {
    createdBy,
    originalShoutContent,
    originalShoutInVoid,
    originalEchoOfShoutInVoid,
    nVoid,
    echosOfEchos,
    replies,
};