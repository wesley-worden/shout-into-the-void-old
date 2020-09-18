const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { APP_SECRET, debug_settings,
VOID_GEOHASH_PRECISION, USER_GEOHASH_PRECISION,
VOID_VIEW_RADIUS, VOID_VIEW_UNITS,
LOCATION_UPDATE_MINIMUM_SECS,
MESSAGE_HASH_SALT } = require('./../config.json');
const clipboardy = require('clipboardy');
const ngeohash = require('ngeohash');
const getHashesNear = require('geohashes-near');
const { mintcream } = require('color-name');
const crypto = require('crypto');

// const VOID_GEOHASH_PRECISION = 5;
// const USER_GEOHASH_PRECISION = 6;
// const VOID_VIEW_RADIUS = 5;
// const VOID_VIEW_UNITS = "miles";
// const LOCATION_UPDATE_MINIMUM_SECS = 15 * 60; //15 mins

const showToken = function(token) {
    console.log("please place into http headers");
    const prettyToken = `{ "Authorization": "Bearer ${token}" }`;
    console.log(prettyToken);
    if (debug_settings.copy_token_to_clipboard) {
        clipboardy.writeSync(prettyToken);
        console.log("copied to clipboard");
    }
}

const ensureAuthorized = async function(context) {
    const Authorization = context.request.get('Authorization');
    if (Authorization) {
        const token = Authorization.replace('Bearer ', '');
        const { userId } = jwt.verify(token, APP_SECRET);
        // if ((await checkIfUserExistsById(context, userId))) {
        //     return userId;
        // }
        return userId;
    }
    throw new Error("Bruh you ain't authenticated bro");
};

const ensureGeohashIsUserPrecision = function(geohash) {
    if(geohash.length < USER_GEOHASH_PRECISION ) {
        throw new Error(`You must use a geohash with a precision of at least ${USER_GEOHASH_PRECISION} characters`);
    }
};

const ensureGeohashIsVoidPrecision = function(geohash) {
    if(geohash.length < VOID_GEOHASH_PRECISION) {
        throw new Error(`You must use a geohash with a precision of at least ${VOID_GEOHASH_PRECISION} characters`);
    }
};

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
const fragmentUserLastLocation = `
fragment LastLocation on User {
    lastLocation
}`
const ensureLastLocationExists = async function(context, userId) {
    const lastLocationUserLocationId = await getLastLocationUserLocationIdForUserId(context, userId);
    const lastLocation = await context.prisma.userLocation({
        userLocationId: lastLocationUserLocationId
    });
    if(!exists(lastLocation)) {
        throw new Error("location must be updated at least once");
    }
}
const ensureLastLocationIsCurrent = async function(context, userId) {
    const lastLocationCreatedAt = await getLastLocationCreatedAtForUserId(context, userId); 
    const createdAtEpochSeconds = convertDateTimeStringToEpochSeconds(lastLocationCreatedAt);
    const nowEpochSeconds = getTimeInEpochSeconds();
    if(nowEpochSeconds - createdAtEpochSeconds > LOCATION_UPDATE_MINIMUM_SECS) {
        throw new Error("User lastLocation is out of date, please updateLocation");
    }
};

const ensureMessageIsNotProfane = function(message) {
    //todo: implement filter and statiscits
};

const exists = function(object) {
    if(object == null || object == undefined) {
        return false;
    }
    return true;
}
const checkIfVoidExistsByVoidGeohash = async function(context, voidGeohash) {
    const nVoid = await context.prisma.nVoid({
        voidGeohash: voidGeohash
    });
    return exists(nVoid);
    // if(nVoid == null || nVoid == undefined) {
    //     return false;
    // } else {
    //     return true;
    // }
}

const checkIfUserExistsById = async function(context, userId) {
    const user = await context.prisma.user({
        userId: userId
    });
    return exists(user);
    // if(user == null || user == undefined) {
    //     return false;
    // } else {
    //     return true;
    // }
}
const user = {
    ensureLocationIsRecent: async function(context, userId) {
        await ensureLastLocationExists(context, userId);
        await ensureLastLocationIsCurrent(context, userId);
    }
}
const vote = {
    updateVoteCount: async function(context, voteBucketId, newVoteCount) {
        console.log(`voteBucketId: ${voteBucketId}`);
        const updatedVoteBucket = await context.prisma.updateVoteBucket({
            where: {
                voteBucketId: voteBucketId
            },
            data: {
                voteCount: newVoteCount 
            }
        });
        return updatedVoteBucket;
    }
}
const shout = {
    ensureShoutExists: async function(context, shoutInVoidId) {
        const shoutExists = await context.prisma.$exists.shoutInVoid({
            shoutInVoidId
        });
        if(!shoutExists) {
            throw new Error("shout does not exist bra");
        }
    },
    getVoteBucketIdByShoutId: async function(context, shoutInVoidId) {
        const fragment = `
        fragment VoteBucketId on ShoutInVoid {
            voteBucket {
                voteBucketId
            }
        }`;
        const shoutFragment = await context.prisma.shoutInVoid({
            shoutInVoidId: shoutInVoidId
        }).$fragment(fragment);
        const voteBucketId = shoutFragment.voteBucket.voteBucketId;
        return voteBucketId;
    },
    getVoteCount: async function(context, shoutInVoidId) {
        const fragment = `
        fragment VoteCount on ShoutInVoid {
            voteBucket {
                voteCount
            }
        }`;
        const shoutFragment = await context.prisma.shoutInVoid({
            shoutInVoidId: shoutInVoidId
        }).$fragment(fragment);
        const voteCount = shoutFragment.voteBucket.voteCount;
        return voteCount;
    }
}

const flattenGeohash = function(geohash, precision) {
    const coordinate = ngeohash.decode(geohash);
    const voidGeohash = ngeohash.encode(coordinate.latitude, coordinate.longitude, precision);
    return voidGeohash;
};

const flattenGeohashToUserGeohash = function(geohash) {
    return flattenGeohash(geohash, USER_GEOHASH_PRECISION);
};

const flattenGeohashToVoidGeohash = function(geohash) {
    return flattenGeohash(geohash, VOID_GEOHASH_PRECISION);
}

const fragmentUserLastLocationUserGeohash = `
fragment LastLocationUserGeohash on User {
    lastLocation {
        userGeohash
    }
}`;
const getLastLocationUserGeohashForUserId = async function(context, userId) {
    const userFragment = await context.prisma.user({
        userId: userId
    }).$fragment(fragmentUserLastLocationUserGeohash);
    if(!exists(userFragment.lastLocation)) {
        throw new Error('you gotto update location firist bro');
    }
    const userGeohash = userFragment.lastLocation.userGeohash;
    return userGeohash;
}

const fragmentUserLastLocationUserLocationId = `
fragment LastLocationUserLocationId on User {
    lastLocation {
        userLocationId
    }
}`;
const getLastLocationUserLocationIdForUserId = async function(context, userId) {
    const userFragment = await context.prisma.user({
        userId: userId
    }).$fragment(fragmentUserLastLocationUserLocationId);
    let lastLocationUserLocationId;
    if(!exists(userFragment.lastLocation)) {
        throw new Error("location must be updatd at least once");
    }
    lastLocationUserLocationId = userFragment.lastLocation.userLocationId;
    return lastLocationUserLocationId;
}

const fragmentNVoidVoidId = `
fragment VoidId on NVoid {
    voidId
}`;
// todo: there has to be a better way
const getVoidIdFromVoidGeohash = async function(context, voidGeohash) {
    const voidFragment = await context.prisma.nVoid({
        voidGeohash: voidGeohash
    }).$fragment(fragmentNVoidVoidId);
    const voidId = voidFragment.voidId;
    return voidId;
}

const fragmentUserLastLocationCreatedAt = `
fragment LastLocationCreatedAt on User {
    lastLocation {
        createdAt
    }
}`;
const getLastLocationCreatedAtForUserId = async function(context, userId) {
    const userFragment = await context.prisma.user({
        userId: userId
    }).$fragment(fragmentUserLastLocationCreatedAt);
    const createdAt = userFragment.lastLocation.createdAt;
    return createdAt;
}

const getNearbyVoidGeohashes = function(userGeohash) {
    const coordinate = ngeohash.decode(userGeohash);
    const nearbyVoidGeohashes = getHashesNear(coordinate, VOID_GEOHASH_PRECISION, VOID_VIEW_RADIUS, VOID_VIEW_UNITS);
    return nearbyVoidGeohashes;
}

const messageHash = async function(message) {
    // const hash = await bcrypt.hash(message, MESSAGE_HASH_SALT);
    // todo: probably needs to be better
    const hash = crypto.createHash('sha1').update(message).digest('hex');
    return hash; 
}

const voteHash = async function(userId, voteBucketId, isUpvote) {
    const isUpvoteChar = isUpvote ? 't' : 'f';
    const stringToHash = `${userId}${voteBucketId}${isUpvoteChar}`;
    const hash = crypto.createHash('sha1').update(stringToHash).digest('hex');
    return hash;
}

const fragmentShoutInVoidVoteCount = `
`
const getVoteCountForShoutId = async function(context, shoutId) {

}

module.exports = { 
    APP_SECRET,
    debug_settings, //are these bad?
    VOID_GEOHASH_PRECISION,
    USER_GEOHASH_PRECISION,
    VOID_VIEW_RADIUS,
    VOID_VIEW_UNITS, 
    user,
    shout,
    vote,
    voteHash,
    ensureAuthorized,
    ensureGeohashIsUserPrecision,
    ensureGeohashIsVoidPrecision,
    ensureLastLocationExists,
    ensureLastLocationIsCurrent,
    ensureMessageIsNotProfane,
    checkIfVoidExistsByVoidGeohash,
    flattenGeohashToUserGeohash,
    flattenGeohashToVoidGeohash,
    getLastLocationUserGeohashForUserId,
    getVoidIdFromVoidGeohash,
    // getLastLocationCreatedAtForUserId,
    getNearbyVoidGeohashes,
    messageHash,
    showToken
};