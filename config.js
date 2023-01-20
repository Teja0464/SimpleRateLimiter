const RATE_LIMIT_WINDOW = 60 * 1000; // Time window for rate limiter - 60 seconds
const RATE_LIMIT_THRESHOLD = 10; // No of requests allowed during RATE_LIMIT_WINDOW

export default {
    RATE_LIMIT_WINDOW,
    RATE_LIMIT_THRESHOLD,
}