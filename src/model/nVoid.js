// resolvers
//todo: permissions for everything
const createdBy = function(parent, args, context, info) {
    return context.prisma.nVoid({ nVoidId: parent.nVoidId })
        .createdBy();
};
const shouts = function(parent, args, context, info) {
    return context.prisma.nVoid({ nVoidId: parent.nVoidId })
        .shouts();
};
const echos = function(parent, args, context, info) {
    return context.prisma.nVoid({ nVoidId: parent.nVoidId })
        .echos();
};

// utils
const fragmentVoidId = `
fragment VoidId on NVoid {
    voidId
}`;
// todo: there has to be a better way
const getVoidIdFromVoidGeohash = async function(context, voidGeohash) {
    const voidFragment = await context.prisma.nVoid({
        voidGeohash
    }).$fragment(fragmentVoidId);
    const voidId = voidFragment.voidId;
    return voidId;
};

module.exports = {
    resolvers: {
        createdBy,
        shouts,
        echos,
    },
    utils: {
        getVoidIdFromVoidGeohash
    }
};