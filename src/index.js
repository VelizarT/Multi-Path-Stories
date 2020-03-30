const path = require('path');
const express = require('express');
require('./db/mongoose');
const hbs = require('hbs');
const Sentence = require('./models/sentence');
const { ObjectID } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

const viewsPath = path.join(__dirname, '../views');
const publicPath = path.join(__dirname, '../public');

app.set('view engine', 'hbs');
app.set('views', viewsPath);

app.use('/public', express.static(publicPath)); 
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/', async (req, res) => {
    app.locals.currentID = '';

    try {
        const startSentence = await Sentence.findOne({ start: true });

        if(startSentence) {
            const nodeOne = await Sentence.findOne({ origin: startSentence._id, node: 1});
            const nodeTwo = await Sentence.findOne({ origin: startSentence._id, node: 2});
            const nodeThree = await Sentence.findOne({ origin: startSentence._id, node: 3});
            const nodeFour = await Sentence.findOne({ origin: startSentence._id, node: 4});
            res.render('main', { 
                startSentence,  
                nodeOne,
                nodeTwo,
                nodeThree,
                nodeFour
            });
        } else {
            res.render('main');
        }
        
        
    } catch (e) {
        res.status(404).send();
    }

});

app.get('/:id', async (req, res) => {
    const id = req.params.id;
    app.locals.currentID = id;

    try {

        if (!ObjectID.isValid(id)) {
            return res.status(404).send();
        }

        const startSentence = await Sentence.findById(id);
        const nodeOne = await Sentence.findOne({ origin: startSentence._id, node: 1});
        const nodeTwo = await Sentence.findOne({ origin: startSentence._id, node: 2});
        const nodeThree = await Sentence.findOne({ origin: startSentence._id, node: 3});
        const nodeFour = await Sentence.findOne({ origin: startSentence._id, node: 4});

        res.render('main', { 
            startSentence,  
            nodeOne,
            nodeTwo,
            nodeThree,
            nodeFour
        });
    } catch(e) {
        res.status(400).send();
    }
});

app.post('/sentences', async (req, res) => {

    const sentence = new Sentence(req.body);

    try {
        await sentence.save();

        res.status(201);
        if(app.locals.currentID) {
            res.redirect('/' + app.locals.currentID);
        } else {
            res.redirect('/');
        }
    } catch(e) {
        res.status(400).send();
    }
});

app.listen(port, () => {
    console.log('Server is listening on port: ' + port);
})