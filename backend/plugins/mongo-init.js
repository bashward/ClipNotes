import fastifyPlugin from 'fastify-plugin'
import Mongo  from '@fastify/mongodb'
import 'dotenv/config'

async function MongoConnect (app, options) {
     app.register(Mongo, {
        forceClose: true,
        url: `${process.env.MONGO_URL}`,
     })
}

export default fastifyPlugin(MongoConnect)