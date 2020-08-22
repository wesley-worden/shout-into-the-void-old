const jwt = require('jsonwebtoken');
// const APP_SECRET = 'bruh-this-needs-to-be-locked-down';
const { APP_SECRET, debug_settings } = require('./../config.json');
const clipboardy = require('clipboardy');
const ngeohash = require('ngeohash');
const { getHashesNear, isInRadius } = require('geohashes-near');

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

const getUserId = function(context) {
    return ensureAuthorized();
    //return ensureAuthorized(context)[0];
};
const VOID_GEOHASH_PRECISION = 5;
const USER_GEOHASH_PRECISION = 6;
const VIEW_RADIUS = 8;
const VIEW_RADIUS_UNITS = 'kilometers';
const fragmentUserCurrentLocationGeohash = `
fragment UserCurrentLocationGeohash on User {
    currentLocationGeohash
}`;
const getCurrentLocationGeohashForUserId = async function(context, userId) {
    console.log(`userId: ${userId}`);
    const userCurrentLocationGeohashObj = await context.prisma.user({ userId: userId }).$fragment(fragmentUserCurrentLocationGeohash);
    //const currentLocationGeohash = await context.prisma.user({ userId: userId }).$fragment(fragmentUserCurrentLocationGeohash)["currentLocationGeohash"];
    //console.log(`user: ${JSON.stringify(context.prisma.user({ userId: userId }))}`);
    const userCurrentLocationGeohash = userCurrentLocationGeohashObj.currentLocationGeohash;
    console.log(`currentLocationGeohash: ${(userCurrentLocationGeohash)}`);
    console.log(`stringy currentLocationGeohash: ${JSON.stringify(userCurrentLocationGeohash)}`);
    return userCurrentLocationGeohash;
};
const fragmentShoutVoteCount = `
fragment ShoutVoteCount on Shout {
    voteCount
}`;
const getVoteCountForShoutId = async function(context, shoutId) {
    const voteCountObj = await context.prisma.shout({ shoutId: shoutId }).$fragment(fragmentShoutVoteCount);
    const shoutVoteCount = voteCountObj.voteCount;
    return shoutVoteCount;
}
/*
const flattenGeohash = function(geohash) {
    const coordinates = ngeohash.decode(geohash);
    return ngeohash.encode(coordinates.latitude, coordinates.longitude, VOID_GEOHASH_PRECISION);
};
*/
const flattenGeohashToUserGeohash = function(geohash) { //todo these are garbage
    const coordinates = ngeohash.decode(geohash);
    return ngeohash.encode(coordinates.latitude, coordinates.longitude, USER_GEOHASH_PRECISION);
}
const flattenUserGeohashToVoidGeohash = function(userGeohash) { //todo these are garbage
    const coordinates = ngeohash.decode(userGeohash);
    return ngeohash.encode(coordinates.latitude, coordinates.longitude, VOID_GEOHASH_PRECISION);
};
const getClosestVoidGeohashForUserId = async function(context, userId) {
    const currentLocationGeohash = await getCurrentLocationGeohashForUserId(context, userId);
    const closestVoidGeohash = currentLocationGeohash.substring(0, VOID_GEOHASH_PRECISION);
    return closestVoidGeohash;
    /*
    const currentLocationGeohash = getCurrentLocationGeohashForUserId(context, userId);
    console.log(`getCurrentLocationGeohashForUserId: ${currentLocationGeohash}`);
    const closestVoidGeohash = flattenUserGeohashToVoidGeohash(currentLocationGeohash);
    console.log(`closestVoidGeohash: ${closestVoidGeohash}`);
    return closestVoidGeohash; */
};
const getVoidFromShoutId = function(context, userId, shoutId) {
    //const userIdFromToken = getUserId(context);
    const nvoid = context.prisma.shout({ shoutId: shoutId }).nvoid();
    const voidGeohash = nvoid.geohash;
    console.log(`voidGeohash: ${JSON.stringify(voidGeohash)}`);
    if(userIdIsAllowedToViewVoidGeohash(context, userId, voidGeohash)) {
        return nvoid;
    } else {
        throw new Error("You are not within range to view this void");
    }
};
const userIdIsAllowedToViewVoidGeohash = function(context, userId, voidGeohash) {
    const from = ngeohash.decode(voidGeohash); //note, not flattening
    const to  = from; //todo: this seems fucked
    const radius = VIEW_RADIUS;
    const units = VIEW_RADIUS_UNITS;
    return isInRadius(from, to, radius, units);
};

const fragmentShoutPostedByUserId = `
fragment ShoutPostedByUserId on Shout {
    postedBy {
        userId
    }
}`;
const shoutIdIsPostedByUserId = function(context, shoutId, userId) {
    const postedBy = context.prisma.shout({ shoutId: shoutId }).postedBy();
    const postedByUserId = postedBy.$fragment(fragmentShoutPostedByUserId);
    if(userId === postedByUserId) {
        return true;
    } else {
        return false;
    }
};
const voidExists = async function(context, voidGeohash) {
    try {
        const possibleVoid = await context.prisma.nVoid({ geohash: voidGeohash });
        if(possibleVoid !== null) {
            return true;
        } else {
            return false;
        }
    } catch {
        return false;
    }
    /*const result = context.prisma.$exists.nvoid({ geohash: voidGeohash});
    console.log(`voidExists result: ${JSON.stringify(result)}`);
    if(!result) { return false } else { return true } */
}

const createVoid = async function(context, voidGeohash, userId) {
    return await context.prisma.createNVoid({
        geohash: voidGeohash,
        createdBy: { 
            connect: { userId: userId }
        }
    });
}
/*
// const channelExists = async function(context, channelId) {
//     return await context.prisma.$exists.channel({
//         channelId: channelId
//     });
// };

const ensureUserExists = async function(context, userId) {
    const userExists = await context.prisma.$exists.user({
        userId: userId
    });
    if (!userExists) {
        throw new Error('User does not exist!');
    }
};

const ensureChannelExists = async function(context, channelId) {
    const channelExists = await context.prisma.$exists.channel({
        channelId: channelId
    });
    if (!channelExists) {
        throw new Error('Channel does not exist!');
    }
};

const ensureShitpostExists = async function(context, shitpostId) {
    const shitpostExists = await context.prisma.$exists.shitpost({
        shitpostId: shitpostId 
    });
    if (!shitpostExists) {
        throw new Error('Shitpost does not exist!');
    }
};

const fragmentChannelOwnerUserId = `
fragment ChannelOwnerId on Channel {
    owner {
       userId 
    }
}`;

const getChannelOwnerId = async function(context, channelId) {
    const channelOwnerId = await context.prisma.channel({ 
        channelId: channelId 
    }).$fragment(fragmentChannelOwnerUserId);
    // }).$fragment(fragmentChannelOwnerId).owner.id;
    // }).$fragment(fragmentChannelOwnerId)["owner"]["id"];
    // showMe(channelOwnerId);
    // console.log(`channelOwnerId: ${JSON.stringify(channelOwnerId)}`);
    const foo = channelOwnerId.owner.userId;
    console.log(`foo: ${JSON.stringify(foo)}`);

    return foo;
}
const ensureUserIsChannelOwner = async function(context, userId, channelId) {
    const channelOwnerId = await getChannelOwnerId(context, channelId);
    // console.log(`channelOwnerId: ${channelOwnerId}`);
    if (userId !== channelOwnerId) {
        console.log(`userId: `, userId);
        console.log(`channelOwnerId: `, channelOwnerId);
        throw new Error("You are not the owner of this channel");
    }
}

const fragmentChannelMemberIds = `
fragment ChannelMemberIds on Channel {
    members {
        channelId
    }
}`;

const getChannelMembers = async function(context, channelId) {
    return await context.prisma.channel({ channelId: channelId }).$fragment(fragmentChannelMemberIds);
}

const showMe = function(variable) {
    const variableName = Object.keys(variable)[0];
    // console.log(Object.keys(variable));
    console.log(`${variableName}: ${JSON.stringify(variable)}`);
}
*/
module.exports = { 
    APP_SECRET,
    debug_settings, //are these bad?
    getUserId, 
    ensureAuthorized,
    getCurrentLocationGeohashForUserId,
    userIdIsAllowedToViewVoidGeohash,
    VOID_GEOHASH_PRECISION,
    getClosestVoidGeohashForUserId,
    getVoidFromShoutId,
    shoutIdIsPostedByUserId,
    flattenGeohashToUserGeohash,
    createVoid,
    voidExists,
    getVoteCountForShoutId,
//    ensureAuthenticated,
    // channelExists, 
    /*
    ensureUserExists,
    ensureChannelExists,
    ensureShitpostExists,
    getChannelOwnerId,
    ensureUserIsChannelOwner,
    getChannelMembers,
    */
    showToken
};