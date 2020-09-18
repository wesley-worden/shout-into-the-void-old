// resolvers
//todo: create permissions for all individual resolvers
const createdBy = function(parent, args, context, info) {
    return context.prisma.replyToEchoOfShoutInVoid({ replyToEchoOfShoutInVoidId: parent.replayToEchoOfShoutInVoidId })
        .createdBy();
};
const content = function(parent, args, context, info) {
    return context.prisma.replyToEchoOfShoutInVoid({ replyToEchoOfShoutInVoidId: parent.replayToEchoOfShoutInVoidId })
        .content();
};
const originalEchoOfShoutInVoid = function(parent, args, context, info) {
    return context.prisma.replyToEchoOfShoutInVoid({ replyToEchoOfShoutInVoidId: parent.replayToEchoOfShoutInVoidId })
        .originalEchoOfShoutInVoid();
};

module.exports = {
    resolvers: {
        createdBy,
        content,
        originalEchoOfShoutInVoid
    }
};