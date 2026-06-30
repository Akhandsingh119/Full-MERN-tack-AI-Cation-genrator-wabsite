const { createClient } = require('redis');

const client = createClient({
    username: 'default',
    password: 'HbQ5UctBxQnyRTdxceoPl8altsTKPWeI',
    socket: {
        host: 'division-euphoric-magic-73016.db.redis.io',
        port: 17593
    }
});


async function connectRedis() {
    try {
        await client.connect();
        console.log('✅ Connected to Redis');
    } catch (err) {
        console.error('❌ Redis connection error:', err);
    }
}

module.exports={connectRedis,client};