//const { ensureAuthorized } = require('../utils');

//todo: create permissions for all individual resolvers

const createdBy = function(parent, args, context, info) {
    return context.prisma.shoutInVoid({ shoutInVoidId: parent.shoutInVoidId })
        .createdBy();
}
const content = function(parent, args, context, info) {
    return context.prisma.shoutInVoid({ shoutInVoidId: parent.shoutInVoidId })
        .content();
}
const nvoid = function(parent, args, context, info) {
    return context.prisma.shoutInVoid({ shoutInVoidId: parent.shoutInVoidId })
        .nvoid();
}
const echos = function(parent, args, context, info) {
    return context.prisma.shoutInVoid({ shoutInVoidId: parent.shoutInVoidId })
        .echos();
}
const replies = function(parent, args, context, info) {
    return context.prisma.shoutInVoid({ shoutInVoidId: parent.shoutInVoidId })
        .replies();
}

module.exports = {
    createdBy,
    content,
    nvoid,
    echos,
    replies,
};