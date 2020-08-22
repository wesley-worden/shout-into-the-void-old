const owner = async function(parent, args, context, info) {
    return await context.prisma.channel({ channelId: parent.channelId }).owner();
}

const memberEdges = async function(parent, args, context, info) {
    return await context.prisma.channel({ channelId: parent.channelId }).memberEdges();
}

const shitposts = async function(parent, args, context, info) {
    return await context.prisma.channel({ channelId: parent.channelId }).shitposts();
}

module.exports = {
    owner,
    memberEdges,
    shitposts
};