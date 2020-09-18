// resolvers
const createdBy = function(parent, args, context, info) {
    return context.prisma.userSavedVoid({ nVoidId: parent.nVoidId })
        .createdBy();
};

module.exports = {
    resolvers: {
        createdBy
    }
};