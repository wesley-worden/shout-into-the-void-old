const { ensureAuthorized } = require('../utils');

//todo: create permissions for all individual resolvers

const shoutInVoid = function(parent, args, context, info) {
    return context.prisma.echoEdge({ contentId: parent.contentId })
        .shoutInVoid();
}
const savedShout = function(parent, args, context, info) {
    return context.prisma.echoEdge({ contentId: parent.contentId })
        .savedShout();
}
const echoInVoid = function(parent, args, context, info) {
    return context.prisma.echoEdge({ contentId: parent.contentId })
        .echoInVoid();
}

module.exports = {
    shoutInVoid,
    savedShout,
    echoInVoid
};