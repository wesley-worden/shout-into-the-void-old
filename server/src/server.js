const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');
const glob = require('glob');
const path = require('path');
// const utils = require('./utils');

// get all resolvers in from source in model folder
console.log('finding all resolvers from model/...');
let resolvers = {};
glob.sync('./src/model/*.js').forEach(function(file) {
    const typeName = file.slice('../src/model/'.length - 1, -3);
    const typeNameUpper = `${typeName.charAt(0).toUpperCase()}${typeName.substring(1)}`;
    console.log(`typeNameNupper: ${typeNameUpper}`)
    // const typeModel = require(path.resolve(file));
    const typeModel = require(`./model/${typeName}`);
    console.log(`typeModel: ${JSON.stringify(typeModel)}`)
    resolvers[`${typeNameUpper}`] = typeModel.resolvers;
});
console.log(`resolvers: ${/*JSON.stringify(*/resolvers/*)*/}`);

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: function(request) {
        return { ...request, prisma };
    }
});

//todo make these work
// utils.ensureRootAdminWasCreated(prisma);
// utils.ensureTestAdminWasCreated(prisma);

console.log('starting server...');
server.start(function() {
    console.log('Server is running on http://localhost:4000');
});

// module.exports = server;