import express from 'express';

import LogQueue from './log-queue.js';
import config from './config.js';

const app = express();
const log = {};

// Rate limiter method to handle the requests by using a map storing the request timestamps in a queue
function rateLimiter (req, res, next) {
    if ( !log[req.ip] ) { // If this is new request from a new user, creating a new Queue to log the requests
        log[req.ip] = new LogQueue();
    }
    const entry = Date.now();
    const result = log[req.ip].push(entry);
    if (!result.success) {
        res.set('X-WAIT-TILL', result.time);
        res.set('X-RATE-LIMIT', config.RATE_LIMIT_WINDOW);
        return res.status(429).send({message: "Request limit exceeded! Try again later."});
    }
    console.log(`Request succeeded at ${new Date(entry)}`); // For future debugging.
    next();
}

app.use(rateLimiter);

app.get('/', (req, res) => {
    return res.status(200).send({message: 'Request Valid'});
});

app.listen(8000, () => {
    console.log('Server running on port 8000');
});