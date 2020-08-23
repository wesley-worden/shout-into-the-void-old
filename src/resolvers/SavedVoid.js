const { ensureAuthorized } = require('./..utils');

//todo: permissions for everything
const createdBy = function(parent, args, context, info) {
    return context.prisma.nVoid({ nVoidId: parent.nVoidId })
        .createdBy();
}

module.exports = {
    createdBy
};