const memberOfChannelEdges = function(parent, args, context, info) {
    const memberOfChannelEdgesResult = context.prisma.user({ userId: parent.userId }).memberOfChannelEdges();
    console.log('memberOfChannelEdgesResult: ', memberOfChannelEdgesResult);
    return memberOfChannelEdgesResult;
}

const ownerOfChannels = function(parent, args, context, info) {
    const ownerOfChannelsResult = context.prisma.user({ userId: parent.userId }).ownerOfChannels();
    console.log('ownerOfChannelsResult', ownerOfChannelsResult);
    console.log('ownerOfChannelsResult.channelId', ownerOfChannelsResult.channelId);
    return ownerOfChannelsResult;
}

module.exports = {
    memberOfChannelEdges,
    ownerOfChannels
};