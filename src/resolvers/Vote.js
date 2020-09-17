//const { ensureAuthorized } = require('./..utils');

const createdBy = function(parent, args, context, info) {
    return context.prisma.vote({ contentId: parent.contentId })
        .createdBy();
}
const voteBucket = function(parent, args, context, info) {
    return context.prisma.vote({ contentId: parent.contentId })
        .voteBucket();
}
module.exports = {
    createdBy,
    voteBucket
};