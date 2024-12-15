const express = require('express');

const app = express();

app.use(function(req, res, next) {
    console.log('First middleware chal raha hai');
    next();  
});

app.use(function(req, res, next) {
    console.log("Second middleware chal raha hai");
    next();
    
});

app.get('/', function(req, res) {
    res.send('Hello World');
});

app.get('/profile', function(req, res, next) {
    return next(new Error("some thing worng"));
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something thing wrong we have any idea');
});

app.listen(3000);
// Implemented Express middleware with error handling

// - Added two middleware functions to log requests before handling routes.
// - The first middleware logs "First middleware chal raha hai" and the second one logs "Second middleware chal raha hai".
// - Created two routes:
//   - `/` route returns "Hello World".
//   - `/profile` route simulates an error by passing a new error to `next()`.
// - Added centralized error handler middleware to catch and log errors.
// - The error handler sends a generic error message to the client with a 500 status code.

