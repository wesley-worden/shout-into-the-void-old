const { ensureAuthorized } = require('../utils');

const nvoid = function(parent, args, context, info) {
    return context.prisma.echo({ voidId: parent.voidId }).nvoid();
};
const originalShout = function(parent, args, context, info) {
    return context.prisma.echo({ voidId: parent.voidId }).originalShout();
};
const createdBy = function(parent, args, context, info) {
    return context.prisma.echo({ voidId: parent.voidId }).createdBy();
};
const echoedBy = function(parent, args, context, info) {
    return context.prisma.echo({ voidId: parent.voidId }).echoedBy();
};

module.exports = {
    nvoid, originalShout, createdBy, echoedBy
};