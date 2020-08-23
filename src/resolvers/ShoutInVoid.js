const { ensureAuthorized } = require('./../utils');

//todo: create permissions for all individual resolvers

const shoutedBy = function(parent, args, context, info) {
    return context.prisma.shoutInVoid({ contentId: parent.contentId })
        .shoutedBy();
}
const content = function(parent, args, context, info) {
    return context.prisma.shoutInVoid({ contentId: parent.contentId })
        .content();
}
const nvoid = function(parent, args, context, info) {
    return context.prisma.shoutInVoid({ contentId: parent.contentId })
        .nvoid();
}
const savedShouts = function(parent, args, context, info) {
    return context.prisma.shoutInVoid({ contentId: parent.contentId })
        .savedShouts();
}
const replies = function(parent, args, context, info) {
    return context.prisma.shoutInVoid({ contentId: parent.contentId })
        .replies();
}
const echoEdges = function(parent, args, context, info) {
    return context.prisma.shoutInVoid({ contentId: parent.contentId })
        .echoEdges();
}

module.exports = {
    shoutedBy,
    content,
    nvoid,
    savedShouts,
    replies,
    echoEdges
};