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

module.exports = { 
    APP_SECRET,
    debug_settings, //are these bad?
    getUserId, 
    ensureAuthorized,
    /*
    getCurrentLocationGeohashForUserId,
    userIdIsAllowedToViewVoidGeohash,
    VOID_GEOHASH_PRECISION,
    getClosestVoidGeohashForUserId,
    getVoidIdFromShoutId,
    shoutIdIsPostedByUserId,
    flattenGeohashToUserGeohash,
    createVoid,
    voidExists,
    getVoteCountForShoutId,
    getRepliesIdsToShoutId,
    getReplyIdFromShoutId,
    getShoutCreatedAt,
    getShoutContent,
    getShoutPostedBy,
    getVoidGeohashFromVoidId,
    */
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