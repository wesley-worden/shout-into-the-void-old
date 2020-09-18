const jwt = require('jsonwebtoken');
const config = require('./../config.json');
const clipboardy = require('clipboardy');
const ngeohash = require('ngeohash');
const getHashesNear = require('geohashes-near');

const showToken = function(token) {
    console.log("please place into http headers");
    const prettyToken = `{ "Authorization": "Bearer ${token}" }`;
    console.log(prettyToken);
    if (config.debug_settings.copy_token_to_clipboard) {
        clipboardy.writeSync(prettyToken);
        console.log("copied to clipboard");
    }
}

const convertDateTimeStringToDate = function(dateTimeString) {
    return date = new Date(dateTimeString);
}
const convertDateToEpochSeconds = function(date) {
    return epochSeconds = Math.round(date.getTime() / 1000);
};
const convertDateTimeStringToEpochSeconds = function(dateTimeString) {
    const date = convertDateTimeStringToDate(dateTimeString);
    return convertDateToEpochSeconds(date);
};
const getTimeInEpochSeconds = function() {
    const date = new Date();
    return convertDateToEpochSeconds(date);
};

const ensureAuthorized = async function(context) {
    const Authorization = context.request.get('Authorization');
    if (Authorization) {
        const token = Authorization.replace('Bearer ', '');
        const { userId } = jwt.verify(token, config.APP_SECRET);
        // if ((await checkIfUserExistsById(context, userId))) {
        //     return userId;
        // }
        return userId;
    }
    throw new Error("Bruh you ain't authenticated bro");
};

const ensureGeohashIsUserPrecision = function(geohash) {
    if(geohash.length < config.USER_GEOHASH_PRECISION ) {
        throw new Error(`You must use a geohash with a precision of at least ${config.USER_GEOHASH_PRECISION} characters`);
    }
};

const ensureGeohashIsVoidPrecision = function(geohash) {
    if(geohash.length < config.VOID_GEOHASH_PRECISION) {
        throw new Error(`You must use a geohash with a precision of at least ${config.VOID_GEOHASH_PRECISION} characters`);
    }
};

const exists = function(object) {
    if(object == null || object == undefined) {
        return false;
    }
    return true;
}

const flattenGeohash = function(geohash, precision) {
    const coordinate = ngeohash.decode(geohash);
    const voidGeohash = ngeohash.encode(coordinate.latitude, coordinate.longitude, precision);
    return voidGeohash;
};

const flattenGeohashToUserGeohash = function(geohash) {
    return flattenGeohash(geohash, config.USER_GEOHASH_PRECISION);
};

const flattenGeohashToVoidGeohash = function(geohash) {
    return flattenGeohash(geohash, config.VOID_GEOHASH_PRECISION);
}

const calculateNearbyVoidGeohashes = function(userGeohash) {
    const coordinate = ngeohash.decode(userGeohash);
    const nearbyVoidGeohashes = getHashesNear(coordinate, config.VOID_GEOHASH_PRECISION, config.VOID_VIEW_RADIUS, config.VOID_VIEW_UNITS);
    return nearbyVoidGeohashes;
}

module.exports = { 
    exists,
    convertDateTimeStringToEpochSeconds,
    getTimeInEpochSeconds,
    ensureAuthorized,
    ensureGeohashIsUserPrecision,
    ensureGeohashIsVoidPrecision,
    flattenGeohashToUserGeohash,
    flattenGeohashToVoidGeohash,
    // getLastLocationCreatedAtForUserId,
    calculateNearbyVoidGeohashes,
    showToken
};