//const { ensureAuthorized } = require('./..utils');

const createdBy = function(parent, args, context, info) {
    return context.prisma.vote({ voteId: parent.voteId })
        .createdBy();
}
const voteBucket = function(parent, args, context, info) {
    return context.prisma.vote({ voteId: parent.voteId })
        .voteBucket();
}
module.exports = {
    createdBy,
    voteBucket
};