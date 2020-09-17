/*
const { 
    utils.ensureAuthorized, 
    debug_settings, 
    //shoutIdIsPostedByUserId 
} = require('./../utils');
*/
const utils = require('./../utils');
const { VOID_GEOHASH_PRECISION } = require('./../utils');

const myUser = async function(parent, args, context, info) {
    const userIdFromToken = await utils.ensureAuthorized(context);
    const user = await context.prisma.user({
        userId: userIdFromToken 
    });
    return user;
    // todo: move to an admin specific query
    // if(user.userId === userIdFromToken /* || isAdmin(userIdFromToken) */) {
    //     return user;
    // } else {
    //     throw new Error("you are not authorized to view this user");
    // }
};

const nearbyVoidGeohashes = async function(parent, args, context, info) {
    const userIdFromToken = await utils.ensureAuthorized(context);
    const lastLocationUserGeohash = await utils.getLastLocationUserGeohashForUserId(context, userIdFromToken);
    const nearbyVoidGeohashes = utils.getNearbyVoidGeohashes(lastLocationUserGeohash);
    return nearbyVoidGeohashes;
};

const getNearbyVoidGeohashesByLocation = async function(parent, args, context, info) {
    const userIdFromToken = await utils.ensureAuthorized(context);
    // check that geohash is at least user precision
    utils.ensureGeohashIsUserPrecision(args.geohash);
    const nearbyVoidGeohashes = utils.getNearbyVoidGeohashes(args.geohash);
    return nearbyVoidGeohashes;
}

const getVoidByVoidGeohash = async function(parent, args, context, info) {
    const userIdFromToken = await utils.ensureAuthorized(context);
    // check that geohash is at least void precision
    utils.ensureGeohashIsVoidPrecision(args.geohash);
    // make sure geohash is exactly void precision
    let voidGeohash = args.geohash;
    if(args.geohash.length !== utils.VOID_GEOHASH_PRECISION) {
        voidGeohash = utils.flattenGeohashToVoidGeohash(args.geohash);
    }
    // now lets get the void from prisma
    const nVoid = await context.prisma.nVoid({
        voidGeohash: voidGeohash
    });
    return nVoid;
};
/*
const getShout = async function(parent, args, context, info) {
    return await context.prisma.shout({ shoutId: args.shoutInVoidId });
    const userIdFromToken = await utils.ensureAuthorized(context);
    const shout = await context.prisma.shout({ shoutId: args.shoutInVoidId });
    if(shoutIdIsPostedByUserId(context, shout.shoutId, userIdFromToken)) {
        return shout;
    } else {
        throw new Error("you are not the creator of this shout");
    }
}
*/
/*
const getShitpost = async function(parent, args, context, info) {
    ensureAuthenticated(context);
    return await context.prisma.shitpost({
        shitpostId: args.shitpostId
    });
};

const getChannel = async function(parent, args, context, info) {
    ensureAuthenticated(context);
    return await context.prisma.channel({
        channelId: args.channelId
    });
};

const getUser = async function(parent, args, context, info) {
    ensureAuthenticated(context);
    return await context.prisma.user({
        userId: args.userId
    });
};
*/
module.exports = {
    myUser,
    nearbyVoidGeohashes,
    // getNearbyVoidGeohashesByLocation,
    // getVoidByVoidGeohash,
    //getShout
    /*
    getShitpost,
    getChannel,
    getUser
    */
};