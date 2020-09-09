//const { ensureAuthorized } = require('../utils');

//todo: create permissions for all individual resolvers

const createdBy = function(parent, args, context, info) {
    return context.prisma.shoutInVoid({ contentId: parent.contentId })
        .createdBy();
}
const content = function(parent, args, context, info) {
    return context.prisma.shoutInVoid({ contentId: parent.contentId })
        .content();
}
const nvoid = function(parent, args, context, info) {
    return context.prisma.shoutInVoid({ contentId: parent.contentId })
        .nvoid();
}
const echos= function(parent, args, context, info) {
    return context.prisma.shoutInVoid({ contentId: parent.contentId })
        .echos();
}
const replies = function(parent, args, context, info) {
    return context.prisma.shoutInVoid({ contentId: parent.contentId })
        .replies();
}

module.exports = {
    createdBy,
    content,
    nvoid,
    echos,
    replies,
};