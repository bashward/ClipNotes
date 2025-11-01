import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import MongoConnect from './plugins/mongo-init.js'
import Routes from './modules/routes.js'
import 'dotenv/config'

const firebaseKey = process.env.FIREBASE_KEY

if (!firebaseKey) {
  throw new Error('FIREBASE_KEY is not set.');
}

const decodedKey = Buffer.from(firebaseKey, 'base64').toString('utf8');

const firebasePrivateKey = JSON.parse(decodedKey);
const app=fastify({
    logger: true
})

//initialise firebase and mongo db storage instances.
app.register(fastifyCors,{
    allowedHeaders: ['Content-Type','Authorization']
})
app.register(MongoConnect)

//initialising routes
app.register(Routes)
app.get('/health',(req,rep)=>{
    rep.send('Server is working fine')
})

const start = async () => {
    try {
    const {default: fastifyFirebase} = await import('fastify-firebase')
    app.register(fastifyFirebase,firebasePrivateKey)

    await app.listen({ port: 3001 || process.env.PORT })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}
start()