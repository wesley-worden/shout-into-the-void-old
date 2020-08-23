const { 
    ensureAuthorized,
    flattenGeohashToVoidGeohash,
    getCurrentLocationFromUserId,
    getVoidIdsWithinRange
} = require('./../utils');

//todo: needs hella more permissions

const getUser = async function(parent, args, context, info) {
    const userIdFromToken = ensureAuthorized(context);
    const user = await context.prisma.user({
        userId: args.userId
    });
    if(user.userId === userIdFromToken /* || isAdmin(userIdFromToken) */) {
        return user;
    } else {
        throw new Error("you are not authorized to view this user");
    }
};
const getClosestVoidByLocation = function (parent, args, context, info) {
    const userIdFromToken = ensureAuthorized();
    const voidGeohash = flattenGeohashToVoidGeohash(parent.geohash);
    return context.prisma.nVoid( {voidGeohash: voidGeohash });
};
const getVoidsWithinRange = function(parent, args, context, info) {
    const userIdFromToken = ensureAuthorized();
    const currentLocationGeohash = getCurrentLocationFromUserId(userIdFromToken);
    const voidIds = getVoidIdsWithinRange(currentLocationGeohash);
    const voids = [];
    voidIds.forEach(function(voidId) {
        voids.push(context.prisma.nVoid({ voidId: voidId }));
    });
    return voids;
}

module.exports = {
    getUser,
    getClosestVoidByLocation,
    getVoidsWithinRange,
};