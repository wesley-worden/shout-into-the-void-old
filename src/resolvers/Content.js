const { ensureAuthorized } = require('./../utils');

const createdBy = function(parent, args, context, info) {
    return context.prisma.content({ contentId: parent.contentId })
        .createdBy();
}

module.exports = {
    createdBy
};