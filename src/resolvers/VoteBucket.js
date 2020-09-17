//const { ensureAuthorized } = require('./..utils');

const votes = function(parent, args, context, info) {
    return context.prisma.voteBucket({ contentId: parent.contentId })
        .votes();
}

module.exports = {
    votes,
};