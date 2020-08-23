const { ensureAuthorized } = require('./../utils');

//todo: permissions for everything
const createdBy = function(parent, args, context, info) {
    return context.prisma.savedVoid({ nVoidId: parent.nVoidId })
        .createdBy();
}

module.exports = {
    createdBy
};