// resolvers
const createdBy = function(parent, args, context, info) {
    return context.prisma.userLocation({ userLocationId: parent.userLocationId })
        .createdBy();
};

module.exports = {
    resolvers: {
        createdBy
    }
};