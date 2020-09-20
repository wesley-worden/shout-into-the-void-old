const utils = require('./../utils');
const config = require('./../../config.json');

// resolvers
//todo: create permissions for all individual user info
const userGenericResolverNames = [
    'adminStatus',
    'createdAdmins'
];
const userGenericResolvers = utils.generateGenericTypeResolvers('User', userGenericResolverNames);


// const adminStatus = function(parent, args, context, info) {
//     return context.prisma.user({ userId: parent.userId })
//         .adminStatus();
// };
// const createdAdmins = function(parent, args, context, info) {
//     return context.prisma.user({ userId: parent.userId })
//         .createdAdmins();
// };
// const lastLocation = function(parent, args, context, info) {
//     return context.prisma.user({ userId: parent.userId })
//         .lastLocation();
// };
// const locationHistory = function(parent, args, context, info) {
//     return context.prisma.user({ userId: parent.userId })
//         .locationHistory();
// };
// const createdContent = function(parent, args, context, info) {
//     return context.prisma.user({ userId: parent.userId })
//         .createdContent();
// };
// const createdVoids = function(parent, args, context, info) {
//     return context.prisma.user({ userId: parent.userId })
//         .createdVoids();
// };
// const savedVoids = function(parent, args, context, info) {
//     return context.prisma.user({ userId: parent.userId })
//         .savedVoids();
// };
// const createdShoutsInVoids = function(parent, args, context, info) {
//     return context.prisma.user({ userId: parent.userId })
//         .createdShoutsInVoids();
// };
// const activatedEchosOfShouts = function(parent, args, context, info) {
//     return context.prisma.user({ userId: parent.userId })
//         .activatedEchosOfShouts();
// };
// const createdEchosOfShoutsInVoid= function(parent, args, context, info) {
//     return context.prisma.user({ userId: parent.userId })
//         .createdEchosOfShoutsInVoid();
// };
// const repliesToShoutsInVoid = function(parent, args, context, info) {
//     return context.prisma.user({ userId: parent.userId })
//         .repliesToShoutsInVoid();
// };
// const repliesToEchosOfShoutsInVoid = function(parent, args, context, info) {
//     return context.prisma.user({ userId: parent.userId })
//         .repliesToEchosOfShoutsInVoid();
// };

// utils
// todo: i dont think this function actually works correctly
const ensureUserExists = async function(context, userId) {
    const userExists = context.prisma.$exists.user({
        userId
    });
    if(!userExists) {
        throw new Error(`User with userId ${userId} does not exist`);
    }
};

const fragmentLastLocationCreatedAt = `
fragment LastLocationCreatedAt on User {
    lastLocation {
        createdAt
    }
}`;
const getLastLocationCreatedAt = async function(context, userId) {
    const userFragment = await context.prisma.user({
        userId
    }).$fragment(fragmentLastLocationCreatedAt);
    const createdAt = userFragment.lastLocation.createdAt;
    return createdAt;
};
const fragmentLastLocationUserLocationId = `
fragment LastLocationUserLocationId on User {
    lastLocation {
        userLocationId
    }
}`;
const getLastLocationUserLocationId = async function(context, userId) {
    const userFragment = await context.prisma.user({
        userId
    }).$fragment(fragmentLastLocationUserLocationId);
    let lastLocationUserLocationId;
    if(!utils.exists(userFragment.lastLocation)) {
        throw new Error('User lastLocation is out of date, please updateLocation');
    }
    lastLocationUserLocationId = userFragment.lastLocation.userLocationId;
    return lastLocationUserLocationId;
};
const ensureLastLocationExists = async function(context, userId) {
    const lastLocationUserLocationId = await getLastLocationUserLocationId(context, userId);
    const lastLocation = await context.prisma.userLocation({
        userLocationId: lastLocationUserLocationId
    });
    if(!utils.exists(lastLocation)) {
        throw new Error('User lastLocation is out of date, please updateLocation');
    }
};
const ensureLastLocationIsCurrent = async function(context, userId) {
    const lastLocationCreatedAt = await getLastLocationCreatedAt(context, userId); 
    const createdAtEpochSeconds = utils.convertDateTimeStringToEpochSeconds(lastLocationCreatedAt);
    const nowEpochSeconds = utils.getTimeInEpochSeconds();
    if(nowEpochSeconds - createdAtEpochSeconds > config.LOCATION_UPDATE_MINIMUM_SECS) {
        throw new Error('User lastLocation is out of date, please updateLocation');
    }
};
const ensureLocationIsUpToDate = async function(context, userId) {
    // todo: bro read trace this code from top to bottom
    // and tell me you are not high
    await ensureLastLocationExists(context, userId);
    await ensureLastLocationIsCurrent(context, userId);
};

const fragmentLastLocationUserGeohash = `
fragment LastLocationUserGeohash on User {
    lastLocation {
        userGeohash
    }
}`;
const getLastLocationUserGeohash = async function(context, userId) {
    const userFragment = await context.prisma.user({
        userId
    }).$fragment(fragmentLastLocationUserGeohash);
    if(!utils.exists(userFragment.lastLocation)) {
        throw new Error('Location out of date, please use mutation updateLocation');
    }
    const userGeohash = userFragment.lastLocation.userGeohash;
    return userGeohash;
}

const fragmentAdminStatusCreatedByUserId = `
fragment AdminStatusCreatedByUserId on User {
    adminStatus {
        createdBy {
            userId
        }
    }
}`;
const adminStatusExists = async function(context, userId) {
    const userFragment = await context.prisma.user({
        userId
    }).$fragment(fragmentAdminStatusCreatedByUserId);
    if(utils.exists(userFragment.adminStatus) && utils.exists(userFragment.adminStatus.createdBy.UserId)) {
        return true;
    } else {
        return false;
    }
};

const isAdmin = async function(context, userId) {
    return adminStatusExists(context, userId);
};
const ensureIsAdmin = async function(context, userId) {
    const isAdmin = await isAdmin(context, userId);
    if(!isAdmin) {
        throw new Error(`User with userId ${userId} is not an admin!`);
    }
};

module.exports = {
    resolvers: {
        ...userGenericResolvers,
        // adminStatus,
        // createdAdmins,
        // lastLocation,
        // locationHistory,
        // createdContent,
        // createdVoids,
        // savedVoids,
        // createdShoutsInVoids,
        // activatedEchosOfShouts,
        // createdEchosOfShoutsInVoid,
        // repliesToShoutsInVoid,
        // repliesToEchosOfShoutsInVoid,
    },
    utils: {
        ensureUserExists,
        ensureLocationIsUpToDate,
        getLastLocationUserGeohash,
        // adminStatusExists
        isAdmin,
        ensureIsAdmin
    }
};