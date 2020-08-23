const jwt = require('jsonwebtoken');
// const APP_SECRET = 'bruh-this-needs-to-be-locked-down';
const { APP_SECRET, debug_settings } = require('./../config.json');
const clipboardy = require('clipboardy');
const ngeohash = require('ngeohash');
const { getHashesNear, isInRadius } = require('geohashes-near');

const VOID_GEOHASH_PRECISION = 5;
const VIEW_RADIUS = 8;
const VIEW_UNITS = 'kilometers';

const showToken = function(token) {
    console.log("please place into http headers");
    const prettyToken = `{ "Authorization": "Bearer ${token}" }`;
    console.log(prettyToken);
    if (debug_settings.copy_token_to_clipboard) {
        clipboardy.writeSync(prettyToken);
        console.log("copied to clipboard");
    }
}

const ensureAuthorized = function(context) {
    const Authorization = context.request.get('Authorization');
    if (Authorization) {
        const token = Authorization.replace('Bearer ', '');
        // showToken(token);
        // console.log("token: ", JSON.stringify(token));
        const { userId } = jwt.verify(token, APP_SECRET);
        return userId;
        //const { userId, currentLocationGeohash } = jwt.verify(token, APP_SECRET);
        //return [ userId, currentLocationGeohash ];
    }
    throw new Error("Bruh you ain't authenticated bro");
};

const flattenGeohashToVoidGeohash = function(geohash) {
    const coordinates = ngeohash.decode(userGeohash);
    const voidGeohash =  ngeohash.encode(coordinates.latitude, coordinates.longitude, VOID_GEOHASH_PRECISION);
    return voidGeohash;
}

const fragmentUserCurrentLocationGeohash = `
fragment CurrentLocationGeohash on User {
    currentLocationGeohash
}`
const getCurrentLocationFromUserId = function(context, userId) {
    const currentLocationGeohashObj = context.prisma.user({ userId: userId })
        .$fragment(fragmentUserCurrentLocationGeohash);
    return currentLocationGeohashObj.currentLocationGeohash; //todo: figure out why
}

const fragmentVoidVoidId = `
fragment VoidId on Void {
    voidId
}`;
const getVoidIdsWithinRange = function(context, voidGeohash) {
    const coordinates = ngeohash.decode(voidGeohash);
    const voidsWithinRangeGeohashs = getHashesNear(coordinates, VOID_GEOHASH_PRECISION, VIEW_RADIUS, VIEW_UNITS);
    const voidIds = voidsWithinRangeGeohashs.map(function(voidGeohash) {
        const voidIdObj = context.prisma.nVoid({ voidGeohash: voidGeohash })
            .$fragment(fragmentVoidVoidId);
        return voidIdObj.voidId;
    });
    return voidIds;

}

module.exports = { 
    APP_SECRET,
    debug_settings, //are these bad?
    ensureAuthorized,
    flattenGeohashToVoidGeohash,
    getCurrentLocationFromUserId,
    getVoidIdsWithinRange
};