const utils = require('./../utils');
const config = require(`./../../config.json`);

const userModel = require(`./../model/user`);

const myUser = async function(parent, args, context, info) {
    const userIdFromToken = await utils.ensureAuthorized(context);
    await userModel.utils.ensureUserExists(context, userIdFromToken);
    const myUser = await context.prisma.user({
        userId: userIdFromToken 
    });
    return myUser;
};

// const nearbyVoids = async function(parent, args, context, info) {
//     const userIdFromToken = await utils.ensureAuthorized(context);
//     await user.utils.ensureUserExists(context, userIdFromToken);
//     await user.utils.ensureLocationIsUpToDate(context, userIdFromToken);
//     const lastLocationUserGeohash = await user.utils.getLastLocationUserGeohash(context, userIdFromToken);
//     const nearbyVoidGeohashes = utils.calculateNearbyVoidGeohashes(lastLocationUserGeohash);
//     console.log(`nearbyVoidGeohashes: ${nearbyVoidGeohashes}`);
//     // const nearbyVoids = nearbyVoidGeohashes.map(async function(voidGeohash) {
//     //     console.log(`voidGeohash: ${voidGeohash}`)
//     //     const nVoid = await context.prisma.nVoid({
//     //         voidGeohash
//     //     });
//     //     console.log(`nVoid: ${JSON.stringify(nVoid)}`)
//     //     return nVoid;
//     // });
//     let nearbyVoids = [];
//     await nearbyVoidGeohashes.forEach(async function(voidGeohash) {
//         const nVoidExists = await context.prisma.$exists.nVoid({
//             voidGeohash
//         });
//         if(nVoidExists) {
//             console.log(`exists`)
//             const nearbyVoid = await context.prisma.nVoid({
//                 voidGeohash
//             });
//             nearbyVoids.push(nearbyVoid);
//             console.log(`nearbyVoids: ${JSON.stringify(nearbyVoids)}`)
//         }
//     });
//     return nearbyVoids;
// }

const nearbyVoidGeohashes = async function(parent, args, context, info) {
    const userIdFromToken = await utils.ensureAuthorized(context);
    const lastLocationUserGeohash = await userModel.utils.getLastLocationUserGeohash(context, userIdFromToken);
    const nearbyVoidGeohashes = utils.calculateNearbyVoidGeohashes(lastLocationUserGeohash);
    return nearbyVoidGeohashes;
};

// const getNearbyVoidGeohashesByLocation = async function(parent, args, context, info) {
//     const userIdFromToken = await utils.ensureAuthorized(context);
//     // check that geohash is at least user precision
//     utils.ensureGeohashIsUserPrecision(args.geohash);
//     const nearbyVoidGeohashes = utils.calculateNearbyVoidGeohashes(args.geohash);
//     return nearbyVoidGeohashes;
// }

const getVoidByVoidGeohash = async function(parent, args, context, info) {
    const userIdFromToken = await utils.ensureAuthorized(context);
    await userModel.utils.ensureUserExists(context, userIdFromToken);
    // check that geohash is at least void precision
    utils.ensureGeohashIsVoidPrecision(args.voidGeohash);
    // make sure geohash is exactly void precision
    let voidGeohash = args.voidGeohash;
    if(args.voidGeohash.length !== config.VOID_GEOHASH_PRECISION) {
        voidGeohash = utils.flattenGeohashToVoidGeohash(args.voidGeohash);
    }
    // now lets get the void from prisma
    const nVoid = await context.prisma.nVoid({
        voidGeohash
    });
    return nVoid;
};

module.exports = {
    resolvers: {
        myUser,
        // nearbyVoids,
        nearbyVoidGeohashes,
        // getNearbyVoidGeohashesByLocation,
        getVoidByVoidGeohash
    }
};