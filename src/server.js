const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');

const content = require('./model/content');
const voteBucket = require('./model/voteBucket');
const vote = require('./model/vote');
const userLocation = require('./model/userLocation');
const user = require('./model/user');
const shoutInVoid = require('./model/shoutInVoid');
const replyToShoutInVoid = require('./model/replyToShoutInVoid');
const userActivatedEchoOfShout = require('./model/userActivatedEchoOfShout');
const echoOfShoutInVoid = require('./model/echoOfShoutInVoid');
const replyToEchoOfShoutInVoid = require('./model/replyToEchoOfShoutInVoid');
const nVoid = require('./model/nVoid');
const userSavedVoid = require('./model/userSavedVoid');

const query = require('./model/query');
const mutation = require('./model/mutation');

const resolvers = {
    Content: content.resolvers,
    VoteBucket: voteBucket.resolvers,
    Vote: vote.resolvers,
    User: user.resolvers,
    UserLocation: userLocation.resolvers,
    ShoutInVoid: shoutInVoid.resolvers,
    ReplyToShoutInVoid: replyToShoutInVoid.resolvers,
    UserActivatedEchoOfShout: userActivatedEchoOfShout.resolvers,
    EchoOfShoutInVoid: echoOfShoutInVoid.resolvers,
    ReplyToEchoOfShoutInVoid: replyToEchoOfShoutInVoid.resolvers,
    NVoid: nVoid.resolvers,
    UserSavedVoid: userSavedVoid.resolvers,

    Query: query.resolvers,
    Mutation: mutation.resolvers
};

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: function(request) {
        return { ...request, prisma };
    }
});

server.start(function() {
    console.log('Server is running on http://localhost:4000');
});