const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');
const glob = require('glob');
const path = require('path');

// get all resolvers in from source in model folder
// const model;
const resolvers = {};
glob.sync('./model/*.js').forEach(function(file) {
    const typeName = file.slice(0, -3);
    const typeNameUpper = `${typeName.charAt(0).toUpperCase()}${typeName.substring(0)}`;
    // model[`${typeName}Model`] = require(path.resolve(file));
    resolvers[`${typeNameUpper}`] = require(path.resolve(file));
});

// const contentModel = require('./model/content');
// const voteBucketModel = require('./model/voteBucket');
// const voteModel = require('./model/vote');
// const userLocationModel = require('./model/userLocation');
// const userModel = require('./model/user');
// const shoutInVoidModel = require('./model/shoutInVoid');
// const replyToShoutInVoidModel = require('./model/replyToShoutInVoid');
// const userActivatedEchoOfShoutModel = require('./model/userActivatedEchoOfShout');
// const echoOfShoutInVoidModel = require('./model/echoOfShoutInVoid');
// const replyToEchoOfShoutInVoidModel = require('./model/replyToEchoOfShoutInVoid');
// const nVoidModel = require('./model/nVoid');
// const userSavedVoidModel = require('./model/userSavedVoid');

// const query = require('./model/query');
// const mutation = require('./model/mutation');
// const resolvers = {
//     Content: contentModel.resolvers,
//     VoteBucket: voteBucketModel.resolvers,
//     Vote: voteModel.resolvers,
//     User: userModel.resolvers,
//     UserLocation: userLocationModel.resolvers,
//     ShoutInVoid: shoutInVoidModel.resolvers,
//     ReplyToShoutInVoid: replyToShoutInVoidModel.resolvers,
//     UserActivatedEchoOfShout: userActivatedEchoOfShoutModel.resolvers,
//     EchoOfShoutInVoid: echoOfShoutInVoidModel.resolvers,
//     ReplyToEchoOfShoutInVoid: replyToEchoOfShoutInVoidModel.resolvers,
//     NVoid: nVoidModel.resolvers,
//     UserSavedVoid: userSavedVoidModel.resolvers,

//     Query: query.resolvers,
//     Mutation: mutation.resolvers
// };

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: function(request) {
        return { ...request, prisma };
    }
});


// server.start(function() {
//     console.log('Server is running on http://localhost:4000');
// });

module.exports = server;