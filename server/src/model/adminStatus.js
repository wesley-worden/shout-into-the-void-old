// resolvers
const createdBy = function(parent, args, context, info) {
    return context.prisma.adminStatus({ adminStatusId: parent.adminStatusId})
        .createdBy();
};
const user = function(parent, args, context, info) {
    return context.prisma.adminStatus({ adminStatusId: parent.adminStatusId})
        .createdBy();
};
// utils


module.exports = {
    resolvers: {
        createdBy,
        user
    },
    utils: {
    }
};