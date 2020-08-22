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
const getCurrentLocationGeohashForUserId = function(context, userId) {
    const currentLocationGeohash = context.prisma.user({ userId: userId }).currentLocationGeohash();
    return currentLocationGeohash;
};
/*
const flattenGeohash = function(geohash) {
    const coordinates = ngeohash.decode(geohash);
    return ngeohash.encode(coordinates.latitude, coordinates.longitude, VOID_GEOHASH_PRECISION);
};
*/
const flattenGeohashToUserGeohash = function(geohash) {
    const coordinates = ngeosh.decode(geohash);
    return ngeohash.encode(coordinates.latitude, coordinates.longitude, USER_GEOHASH_PRECISION);
}
const flattenUserGeohashToVoidGeohash = function(userGeohash) {
    const coordinates = ngeohash.decode(userGeohash);
    return ngeohash.encode(coordinates.latitude, coordinates.longitude, VOID_GEOHASH_PRECISION);
};
const getClosestVoidGeohashForUserId = function(context, userId) {
    const currentLocationGeohash = getCurrentLocationGeohashForUserId(context, userId);
    const closestVoidGeohash = flattenUserGeohashToVoidGeohash(currentLocationGeohash);
    return closestVoidGeohash;
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
    userIdIsAllowedToViewVoidGeohash,
    getVoidFromShoutId,
    shoutIdIsPostedByUserId,
    flattenGeohashToUserGeohash,
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