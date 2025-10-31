const Fastify=require('fastify')
const cors=require('@fastify/cors')
const Mongo=require('./plugins/mongo-init')
const fastifyFirebase=require('fastify-firebase')
const Routes=require('./modules/routes')
require('dotenv').config()

const firebaseKey = process.env.FIREBASE_KEY

if (!firebaseKey) {
  throw new Error('FIREBASE_KEY is not set.');
}

const decodedKey = Buffer.from(firebaseKey, 'base64').toString('utf8');

const firebasePrivateKey = JSON.parse(decodedKey);
const app=Fastify({
    logger: true
})

//initialise firebase and mongo db storage instances.
app.register(cors,{
    allowedHeaders: ['Content-Type','Authorization']
})
app.register(fastifyFirebase,firebasePrivateKey)
app.register(Mongo)

//initialising routes
app.register(Routes)
app.get('/health',(req,rep)=>{
    rep.send('Server is working fine')
})

app.listen({port: 3001}, (err,address)=>{
    if(err) {
        app.log.error(err)
        process.exit(1)
    }
})