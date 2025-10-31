const FastifyPlugin=require('fastify-plugin')
const Mongo=require('@fastify/mongodb')
require('dotenv').config()

async function MongoConnect (app, options) {
     app.register(Mongo, {
        forceClose: true,
        url: `${process.env.MONGO_URL}`,
     })
}

module.exports = FastifyPlugin(MongoConnect)