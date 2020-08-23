const { ensureAuthorized } = require('./..utils');

//todo: permissions for everything
const createdBy = function(parent, args, context, info) {
    return context.prisma.nVoid({ nVoidId: parent.nVoidId })
        .createdBy();
}
const shouts = function(parent, args, context, info) {
    return context.prisma.nVoid({ nVoidId: parent.nVoidId })
        .shouts();
}
const echos = function(parent, args, context, info) {
    return context.prisma.nVoid({ nVoidId: parent.nVoidId })
        .echos();
}

module.exports = {
    createdBy,
    shouts,
    echos,
};