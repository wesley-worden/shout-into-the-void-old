const { getUserId, userIdIsAllowedToViewVoidGeohash, getVoidFromShoutId, shoutIdIsPostedByUserId } = require('./../utils');
/*
const fragmentShoutPostedByUserId = `
fragment ShoutPostedByUserId on Shout {
    postedBy {
        userId
    }
}`;
const shoutIdIsPostedByUserId = function(shoutId, userId) {
    const postedBy = context.prisma.shout({ shoutId: shoutId }).postedBy();
    const postedByUserId = postedBy.$fragment(fragmentShoutPostedByUserId);
    if(userId === postedByUserId) {
        return true;
    } else {
        return false;
    }
};
*/
const postedBy = function(parent, args, context, info) {
    //actually, lets have usernames
    return context.prisma.shout({ shoutId: parent.shoutId }).postedBy();
    //should only be allowed if current user is creator of shout
    /*
    const userIdFromToken  = getUserId(context); //ensures authorized
    if(shoutIdIsPostedByUserId(parent.shoutId, userIdFromToken)) {
        return context.prisma.shout({ shoutId: parent.shoutId }).postedBy();
    } else {
        throw new Error("You are not the creator of this shout");
    } */

};
const echos = function(parent, args, context, info) {
    //let people see if a shout has echos and who by
    return context.prisma.shout({ shoutId: parent.shoutId }).echos();
    /*
    //should only be allowed if current user is creator of shout
    const userIdFromToken  = getUserId(context); //ensures authorized
    if(shoutIdIsPostedByUserId(parent.shoutId, userIdFromToken)) {
        return context.prisma.shout({ shoutId: parent.shoutId }).echos();
    } else {
        throw new Error("You are not the creator of this shout");
    }
    */
};
/*
const fragmentVoidGeohash = `
fragment VoidGeohash on Void {
    geohash {
        userId
    }
}`
*/
const nvoid = function(parent, args, context, info) {
    //make void level permissions
    return context.prisma.shout({ shoutId: parent.shoutId }).nvoid();
    /*
    //user can only view void if within range //todo: allow if saved
    const userIdFromToken = getUserId(context);
    const nvoid = getVoidFromShoutId(context, userIdFromToken, shoutId); //permissions handled in helper funtion
    return nvoid;
    */
    /*
    const nvoid = context.prisma.shout({ shoutId: parent.shoutId }).nvoid();
    const voidGeohash = nvoid.geohash;
    console.log(`voidGeohash: ${JSON.stringify(voidGeohash)}`);
    if(userIdIsAllowedToViewVoidGeohash(context, userId, voidGeohash)) {
        return nvoid;
    } else {
        throw new Error("You are not within range to view this void");
    }*/
};
const replies = function(parent, args, context, info) {
    //user can only view replies if within range of void
    //const userIdFromToken = getUserId(context);
    return context.prisma.shout({ shoutId: parent.shoutId }).replies();
    const nvoid = getVoidFromShoutId(context, parent.shoutId);
    const voidGeohash = nvoid.geohash;
    if(userIdIsAllowedToViewVoidGeohash(context, userIdFromToken, voidGeohash)) {
        return context.prisma.shout({ shoutId: parent.shoutId }).replies();
    } else {
        throw new Error("You are not within range of the void where the original shout was posted");
    }
}
/*
const channel = function(parent, args, context, info) {
    return context.prisma.shitpost({ shitpostId: parent.shitpostId }).channel();
}*/

module.exports = {
    postedBy,
    echos,
    nvoid,
    replies
    //channel
};