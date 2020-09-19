const server = require('./server');

server.start(function() {
    console.log('Server is running on http://localhost:4000');
});