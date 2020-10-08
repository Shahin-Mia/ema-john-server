const express = require('express')
const app = express()
const port = 4000
const cors = require('cors');
const bodyParser = require('body-parser');
require("dotenv").config();


app.use(bodyParser.json());
app.use(cors());

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nt3jq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db(process.env.DB_NAME).collection("products");
    console.log("Database connected")

    app.post('/addProduct', (req, res) => {
        const products = req.body;
        collection.insertMany(products)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result);
            })
    })
    app.get('/products', (req, res) => {
        collection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.get('/product/:key', (req, res) => {
        collection.find({ key: req.params.key })
            .toArray((err, document) => {
                res.send(document[0])
            })
    })

    app.post('/productKeys', (req, res) => {
        collection.find({ key: { $in: req.body } })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})