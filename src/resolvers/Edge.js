const user = function(parent, args, context, info) {
    return context.prisma.edge({ edgeId: parent.edgeId }).user();
}

const channel = function(parent, args, context, info) {
    return context.prisma.edge({ edgeId: parent.edgeId }).channel();
}

module.exports = {
    user,
    channel
};