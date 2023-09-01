// Importer
import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';

// Express
const app = express();
const PORT = 5000;

// mongodb
// client, db & collection
const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('bank');
const accountCol = db.collection('account');

// middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(cors());

// API routes
// hämta alla acc (http://localhost:5000/api/accounts)
app.get('/api/accounts', async (req,res) => {
    let accounts = await accountCol.find({}).toArray();
    res.json(accounts);
});

// hämta ett acc
app.get('/api/accounts/:id', async (req,res) => {
    const account = await accountCol.findOne({ _id: new ObjectId(req.params.id) });
    res.json(account);
});

// uppdatera acc
app.put('/api/accounts/:id', async (req, res) => {
    let account = await accountCol.findOne({ _id: new ObjectId(req.params.id) });
    account = {
        ...account,
        ...req.body,
        updatedAt: new Date()
    };
    await accountCol.updateOne({ _id: new ObjectId(req.params.id) }, { $set: account });
    res.json({
        success: true,
        account
    });
});

// ta bort acc
app.delete('/api/accounts/:id', async (req, res) => {
    await accountCol.deleteOne({ _id: new ObjectId(req.params.id) });
    res.status(204).send();
});

// skapa nytt acc
app.post('/api/accounts', async (req, res) => {
    const account = {
        ...req.body,
        updatedAt: new Date()
    };
    await accountCol.insertOne(account);
    res.json({
        success: true,
        account
    });
});

// listen
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});