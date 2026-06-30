const { client } = require('../Database/Redis');

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60 * 1000; // 1 minute
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 20;
const KEY_PREFIX = 'rate_limit:';

// Atomic Lua script: slide window, add current request, count and expire key
const SLIDE_WINDOW_SCRIPT = `
    local key = KEYS[1]
    local now = tonumber(ARGV[1])
    local window = tonumber(ARGV[2])
    local member = ARGV[3]

    local oldest = now - window
    redis.call('ZREMRANGEBYSCORE', key, '-inf', oldest)
    redis.call('ZADD', key, now, member)
    local count = redis.call('ZCARD', key)
    redis.call('PEXPIRE', key, window)

    return count
`;

const rateLimiter = async (req, res, next) => {
    try {
        const identifier = req.ip || 'unknown';
        const key = `${KEY_PREFIX}${identifier}`;
        const now = Date.now();
        const member = `${now}-${Math.random().toString(36).slice(2)}`;

        const count = await client.eval(SLIDE_WINDOW_SCRIPT, {
            keys: [key],
            arguments: [now.toString(), WINDOW_MS.toString(), member],
        });

        const remaining = Math.max(0, MAX_REQUESTS - count);

        res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
        res.setHeader('X-RateLimit-Remaining', remaining);
        res.setHeader('X-RateLimit-Reset', now + WINDOW_MS);

        if (count > MAX_REQUESTS) {
            return res.status(429).json({
                success: false,
                message: 'Too many requests. Please try again later.',
            });
        }

        next();
    } catch (error) {
        console.error('Rate limiter error:', error.message);
        // Fail open so the app keeps working if Redis is unreachable
        next();
    }
};

module.exports = rateLimiter;
 


/*
const rateLimiter = async (req, res, next) => {
    try {
        const ip = req.ip;
        console.log(ip) 
        const count = await client.incr(ip);
        console.log(count);
        if (count == 1) {
            await client.expire(ip, 3600);
        }

        if (count > 5) {
            throw new Error("user limit exceeded");
        }

        next();
    } catch (error) {
        res.send("Error" + error);
    }
}

module.exports = rateLimiter

*/



