const crypto = require('crypto');

// resolvers
const createdBy = function(parent, args, context, info) {
    return context.prisma.content({ contentId: parent.contentId })
        .createdBy();
};

// utils
const ensureMessageIsNotProfane = function(message) {
    //todo: implement filter and statistics
    return null;
};
const calculateUniqueContentMessageHash = async function(message) {
    // todo: probably needs to be better
    const hash = crypto.createHash('sha1').update(message).digest('hex');
    return hash; 
};

module.exports = {
    resolvers: {
        createdBy
    },
    utils: {
        ensureMessageIsNotProfane,
        calculateUniqueContentMessageHash
    }
};