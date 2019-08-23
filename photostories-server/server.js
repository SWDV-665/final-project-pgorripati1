// Set up
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors = require('cors');

// Configuration
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/photostories");

app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser({limit: '5mb'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());
app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, POST, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Model
var Grocery = mongoose.model('PhotoStory', {
	img: { data: Buffer, contentType: String },
    header: String,
    story: String
});


// Get all items
app.get('/api/photostories', function (req, res) {

    console.log("Listing items...");

    //use mongoose to get all items in the database
    Grocery.find(function (err, photostories) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(photostories); // return all items in JSON format
    });
});

// Create a Item
app.post('/api/photostories', function (req, res) {

    console.log("Creating item...");

    Photostory.create({
		img: req.body.img,
        header: req.body.header,
        story: req.body.story,
        done: false
    }, function (err, photostory) {
        if (err) {
            res.send(err);
        }

        // create and return all the photostories
        Grocery.find(function (err, photostories) {
            if (err)
                res.send(err);
            res.json(photostories);
        });
    });

});

// Update an Item
app.put('/api/photostories/:id', function (req, res) {
    const photostory = {
		img: req.body.img,
        header: req.body.header,
        story: req.body.story
    };
    console.log("Updating item - ", req.params.id);
    Photostory.update({_id: req.params.id}, photostory, function (err, raw) {
        if (err) {
            res.send(err);
        }
        res.send(raw);
    });
});


// Delete a Item
app.delete('/api/photostories/:id', function (req, res) {
    Photostory.remove({
        _id: req.params.id
    }, function (err, photostory) {
        if (err) {
            console.error("Error deleting photostory ", err);
        }
        else {
            Photostory.find(function (err, photostories) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.json(photostories);
                }
            });
        }
    });
});


// Start app and listen on port 8080  
app.listen(process.env.PORT || 8080);
console.log("Photostories server listening on port  - ", (process.env.PORT || 8080));