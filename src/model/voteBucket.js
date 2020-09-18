// resolvers
const votes = function(parent, args, context, info) {
    return context.prisma.voteBucket({ voteBucketId: parent.voteBucketId })
        .votes();
};

//utils
const updateVoteCount = async function(context, voteBucketId, newVoteCount) {
    console.log(`voteBucketId: ${voteBucketId}`);
    const updatedVoteBucket = await context.prisma.updateVoteBucket({
        where: {
            voteBucketId: voteBucketId
        },
        data: {
            voteCount: newVoteCount 
        }
    });
    return updatedVoteBucket;
};

module.exports = {
    resolvers: {
        votes
    },
    utils: {
        updateVoteCount
    }
};