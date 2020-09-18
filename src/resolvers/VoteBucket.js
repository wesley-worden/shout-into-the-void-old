//const { ensureAuthorized } = require('./..utils');

const votes = function(parent, args, context, info) {
    return context.prisma.voteBucket({ voteBucketId: parent.voteBucketId })
        .votes();
}

module.exports = {
    votes,
};