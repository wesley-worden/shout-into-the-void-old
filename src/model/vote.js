const crypto = require('crypto');

// resolvers
const createdBy = function(parent, args, context, info) {
    return context.prisma.vote({ voteId: parent.voteId })
        .createdBy();
};
const voteBucket = function(parent, args, context, info) {
    return context.prisma.vote({ voteId: parent.voteId })
        .voteBucket();
};

// utils
const calculateUniqueHash = async function(userId, voteBucketId, isUpvote) {
    const isUpvoteChar = isUpvote ? 't' : 'f';
    const stringToHash = `${userId}${voteBucketId}${isUpvoteChar}`;
    const hash = crypto.createHash('sha1').update(stringToHash).digest('hex');
    return hash;
};

module.exports = {
    resolvers: {
        createdBy,
        voteBucket
    },
    utils: {
        calculateUniqueHash
    }
};
