// resolvers
//todo: create permissions for all individual resolvers
const createdBy = function(parent, args, context, info) {
    return context.prisma.shoutInVoid({ shoutInVoidId: parent.shoutInVoidId })
        .createdBy();
};
const content = function(parent, args, context, info) {
    return context.prisma.shoutInVoid({ shoutInVoidId: parent.shoutInVoidId })
        .content();
};
const nVoid = function(parent, args, context, info) {
    return context.prisma.shoutInVoid({ shoutInVoidId: parent.shoutInVoidId })
        .nVoid();
};
const voteBucket = function(parent, args, context, info) {
    return context.prisma.shoutInVoid({ shoutInVoidId: parent.shoutInVoidId })
        .voteBucket();
};
const echos = function(parent, args, context, info) {
    return context.prisma.shoutInVoid({ shoutInVoidId: parent.shoutInVoidId })
        .echos();
};
const replies = function(parent, args, context, info) {
    return context.prisma.shoutInVoid({ shoutInVoidId: parent.shoutInVoidId })
        .replies();
};

// utils
const ensureShoutExists = async function(context, shoutInVoidId) {
    const shoutExists = await context.prisma.$exists.shoutInVoid({
        shoutInVoidId
    });
    if(!shoutExists) {
        throw new Error(`ShoutInVoid with shoutInVoidId ${shoutInVoidId} does not exist`);
    }
};
const fragmentVoteBucketId = `
fragment VoteBucketId on ShoutInVoid {
    voteBucket {
        voteBucketId
    }
}`;
const getVoteBucketId = async function(context, shoutInVoidId) {
    const shoutFragment = await context.prisma.shoutInVoid({
        shoutInVoidId
    }).$fragment(fragmentVoteBucketId);
    const voteBucketId = shoutFragment.voteBucket.voteBucketId;
    return voteBucketId;
};
const fragmentVoteCount = `
fragment VoteCount on ShoutInVoid {
    voteBucket {
        voteCount
    }
}`;
const getVoteCount = async function(context, shoutInVoidId) {
    const shoutFragment = await context.prisma.shoutInVoid({
        shoutInVoidId
    }).$fragment(fragmentVoteCount);
    const voteCount = shoutFragment.voteBucket.voteCount;
    return voteCount;
};

module.exports = {
    resolvers: {
        createdBy,
        content,
        nVoid,
        voteBucket,
        echos,
        replies,
    },
    utils: {
        ensureShoutExists,
        getVoteBucketId,
        getVoteCount
    }
};