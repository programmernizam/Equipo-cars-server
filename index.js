const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s7i3i.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
function verifyJwt(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorize Access" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "Forbidden Access" });
    }
    req.decoded = decoded;
    next();
  });
}
async function run() {
  try {
    await client.connect();
    const partsCollection = client.db("equipoCars").collection("parts");
    const reviewsCollection = client.db("equipoCars").collection("reviews");
    const ordersCollection = client.db("equipoCars").collection("orders");
    // Add parts method
    app.post("/parts", async (req, res) => {
      const parts = req.body;
      const result = await partsCollection.insertOne(parts);
      res.send(result);
    });
    // Get Parts method
    app.get("/parts", async (req, res) => {
      const query = {};
      const cursor = partsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/parts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const item = await partsCollection.findOne(query);
      if (item) {
        res.send(item);
      } else {
        res.send("Record Not Found");
      }
    });
    app.put("/parts/:id", async (req, res) => {
      const id = req.params.id;
      const updateItem = req.body;
      const filter = {_id: ObjectId(id)};
      const option = {upsert: true};
      const updateDoc = {
        $set:{
          quantity : updateItem.updateQuantity
        }
      }
      const result = await partsCollection.updateOne(filter, updateDoc, option)
      res.send(result)
    });
    // Add Review method
    app.post("/reviews", async (req, res) => {
      const parts = req.body;
      const result = await reviewsCollection.insertOne(parts);
      res.send(result);
    });
    // Get Review method
    app.get("/reviews", async (req, res) => {
      const query = {};
      const cursor = reviewsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // Get Order Details
    app.post("/orders", async (req, res) => {
      const item = req.body;
      const orders = await ordersCollection.insertOne(item);
      res.send(orders);
    });
    app.get("/orders", async (req, res) => {
      const query = {};
      const orders = await ordersCollection.find(query).toArray();
      res.send(orders);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("Hello world");
});
app.listen(port, () => {
  console.log("Worked");
});
