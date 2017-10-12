const express = require("express");
const app = express();

const exphbs  = require('express-handlebars');

const greetings = require("./modules/greetings.js");

const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const cors = require('cors');

app.set("port", (process.env.port || 5000));

app.engine("handlebars", exphbs({ defaultLayout: 'main' }));
app.set("view engine", "handlebars");

app.use(function(req, res, next) {
    console.log(Date.now());
    req.name = "Rajesh";
    next();
})

// app.use(cors);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

mongoose.connect('mongodb://localhost/vidjot-dev', {
    useMongoClient:true
})
    .then(() => {
        console.log("connected")
    })
    .catch((err) => {
        console.log(err)
    })

//Load idea model
require('./models/idea');
const Idea = mongoose.model('ideas');

app.get("/english", (req, res) => {
    res.send(greetings.sayHelloInEnglish('Rajesh'));
})

app.get("/spanish", (req, res) => {
    res.send(greetings.sayHelloInSpanish());
})

app.get("/", (req, res) => {
	const title = "My Title";
    res.render('index',{
    	title:title
    });
})

app.get("/about", (req, res) => {

    res.render('about');
})

app.post("/ideas",(req,res) => {
    let errors = [];

    if(!req.body.title){
        errors.push({text:"Please add a title"});
    }
    if(!req.body.details){
        errors.push({text:"Please add some details"});
    }

    if(errors.length > 0){
        res.render('ideas/add',{
            errors:errors,
            title:req.body.title,
            details:req.body.details
        })
    }else{
        res.send('passed');
    }


})

app.get("/ideas/add", (req,res) => {
    res.render('ideas/add');
    // console.log('djdj')
})


app.listen(app.get('port'), function() {
    console.log(`App running on ${app.get('port')}`)
})