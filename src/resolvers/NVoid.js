const { ensureAuthorized } = require('./../utils');

const shouts = function(parent, args, context, info) {
    return context.prisma.nvoid({ voidId: parent.voidId }).shouts();
};
const echos = function(parent, args, context, info) {
    return context.prisma.nvoid({ voidId: parent.voidId }).echos();
};
const createdBy = function(parent, args, context, info) {
    return context.prisma.nvoid({ voidId: parent.voidId }).createdBy();
};

module.exports = {
    shouts,
    echos,
    createdBy
};