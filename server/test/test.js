const assert = require('assert');
const { ApolloClient, InMemoryCache, gql } = require('@apollo/client');
const { iterateObserversSafely } = require('@apollo/client/utilities');
const prisma = require(`./../src/generated/prisma-client`);
const utils = require('./../src/utils');

const client = new ApolloClient({
    uri: 'http://localhost:4000',
    cache: new InMemoryCache()
});

console.log('help');
describe('Query', function() {
    describe('signup', function() {
        describe('when using signup to create a new unique user', function() {
            const username = `PepeSilvia${utils.randomString(8)}`;
            const password = `testingpassword${utils.randomString(8)}`;
            let response;
            before(function() {
                const mutation = `
                mutation {
                    signup()
                }`
                // const mutation = `
                // mutation Signup($username: String!, $password: String!) {
                //     signup (
                //         username: $username,
                //         password: $password
                //     ) {
                //         token
                //         user {
                //             userId
                //             createdAt
                //             username
                //             password
                //         }
                //     }
                // }`;
                const variables = { username, password };
                response = mangle(mutation, variables);
                console.log(`respones: ${response}`)
            });
            it('should return a token', function() {
                console.log(`respones: ${response}`)

                assert.equal(utils.exists(response.token), true);
                assert.equal(utils.exists(response.token.Authorization), true);
            });
            it('should return a user', function() {
                assert.equal(utils.exists(response.user), true);
            });
            // after(function() {
            //     const query = `
            //     query`
            // })
        });
    });
});
const hmu = function(query) {
    client.query({
        query: gql`${query}`
    }).then(function(result) {
        return result;
    });
};

const mangle = function(mutation, variables) {
    client.mutate({
        mutation: gql`${mutation}`,
        variables
    }).then(function(result) {
        return result;
    });
};

// // const randomString = function(length) {
//    let result           = '';
//    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//    const charactersLength = characters.length;
//    for ( let i = 0; i < length; i++ ) {
//       result += characters.charAt(Math.floor(Math.random() * charactersLength));
//    }
//    return result;
// };