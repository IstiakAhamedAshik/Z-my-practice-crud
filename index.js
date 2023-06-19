const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
var cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// user :myPracticeData
//pass:KrNVmt0O0sJw7DuU
const uri =
  'mongodb+srv://myPracticeData:KrNVmt0O0sJw7DuU@cluster0.fhpnqfy.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {
    const userCollection = client.db('myPracticeData').collection('products')

    //createdata/postdata
    app.post('/product', async (req, res) => {
      const product = req.body
      console.log(product)
      const result = await userCollection.insertOne(product)
      res.send(result)
    })
    //get data..
    app.get('/product', async (req, res) => {
      const query = {}
      const cursor = userCollection.find(query)
      const products = await cursor.toArray()
      res.send(products)
    })
    //delete data
    app.delete('/product/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await userCollection.deleteOne(query)
      //console.log(result)
      res.send(result)
    })
    //update Data
    app.get('/product/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const product = await userCollection.findOne(query)
      console.log(product)
      res.send(product)
    })
    app.put('/product/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const product = req.body
      const option = { upsert: true }
      const updateUser = {
        $set: {
          name: product.name,
          picture: product.picture,
          price: product.price,
        },
      }
      const result = await userCollection.updateOne(filter, updateUser, option)
      res.send(result)
    })
  } finally {
    //await client.close()
  }
}
run().catch((error) => console.log('error:', error))

app.get('/', (req, res) => {
  res.send('Here is Z-myPractice Crud')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
