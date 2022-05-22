const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASS}@cluster0.s7i3i.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const partsCollection = client.db("equipoCars").collection("parts");
    // Add parts method
    app.post("/parts", async (req, res) => {
      const parts = await partsCollection.insertOne(req.body);
      res.send(parts);
    });
    // Get Parts method
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
