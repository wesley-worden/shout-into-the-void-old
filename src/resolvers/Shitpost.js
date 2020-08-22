const postedBy = function(parent, args, context, info) {
    return context.prisma.shitpost({ shitpostId: parent.shitpostId }).postedBy();
}

const channel = function(parent, args, context, info) {
    return context.prisma.shitpost({ shitpostId: parent.shitpostId }).channel();
}

module.exports = {
    postedBy,
    channel
};