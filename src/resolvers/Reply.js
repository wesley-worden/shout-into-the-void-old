const { ensureAuthorized } = require('./../utils');

const originalShout = function(parent, args, context, info) {
    return context.prisma.reply({ voidId: parent.voidId }).originalShout();
};
const postedBy= function(parent, args, context, info) {
    return context.prisma.reply({ voidId: parent.voidId }).postedBy();
};

module.exports = {
    originalShout,
    postedBy
};