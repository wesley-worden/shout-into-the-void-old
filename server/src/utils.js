const jwt = require('jsonwebtoken');
const config = require('./../config.json');
const clipboardy = require('clipboardy');
const ngeohash = require('ngeohash');
const getHashesNear = require('geohashes-near');
// const { ApolloClient, InMemoryCache, gql } = require('@apollo/client');

// const apolloClient = new ApolloClient({
//     uri: 'http://localhost:4000',
//     cache: new InMemoryCache()
// });

// const hmu = function(query) {
//     apolloClient.query({
//         query: gql`${query}`
//     }).then(function(result) {
//         return result;
//     });
// };

// neato
const generateGenericTypeResolvers = function(typeName, typeResolverNames) {
    const typeIdName = `${typeName.charAt(0).toLowerCase()}${typeName.substring(0)}Id`
    const typeResolvers = {};
    typeResolverNames.forEach(function(resolverName) {
        typeResolvers[`${resolverName}`] = function(parent, args, context, info) {
            const typeWhere = {};
            typeWhere[`${typeIdName}`] = parent[`${typeIdName}`];
            return context.prisma[`${typeName}`](typeWhere)[`${resolverName}`];
        }
    });
    return typeResolvers;
};
// const checkAndCreateAdmin = async function(prisma, username, password) {
//     console.log(`checking for User ${username}`);
//     const userExists = prisma.$exists.user({
//         username
//     });
//     if(!userExists) {
//         console.log(`creating User ${username}`);
//         const query = `
//         mutation {
//             signup(
//                 username: "${username}",
//                 password: "${password}"
//             ) {
//                 user {
//                     userId
//                 }
//             }
//         }`;
//         const response = hmu(query);
//         const userId = response.user.userId;
//         console.log(`created User ${username} with userId ${userId}`);
//         console.log(`manually creating AdminStatus`);
//         await prisma.createAdminStatus({
//             createdBy: {
//                 connect: {
//                     userId
//                 }
//             },
//             user: {
//                 connect: {
//                     userId
//                 }
//             }
//         });
//     }
// };
// const ensureRootAdminWasCreated = function(prisma) {
//     checkAndCreateAdmin(prisma, config.ROOT_ADMIN_USERNAME, config.ROOT_ADMIN_PASSWORD);
// };
// const ensureTestAdminWasCreated = function(prisma) {
//     checkAndCreateAdmin(prisma, config.TEST_ADMIN_USERNAME, config.TEST_ADMIN_PASSWORD);
// };

const randomString = function(length) {
   let result           = '';
   const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   const charactersLength = characters.length;
   for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
};
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

const ensureUserGeohashIsWithinRangeOfVoidGeohash = function(userGeohash, shoutGeohash) {

}

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
    generateGenericTypeResolvers,
    // hmu,
    // ensureRootAdminWasCreated,
    // ensureTestAdminWasCreated,
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
    showToken,
    randomString,
};