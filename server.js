const express = require("express");

const app = express();
const path = require('path');


const exphbs  = require('express-handlebars');

const greetings = require("./modules/greetings.js");

const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const url = require('url');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const ideas = require("./routes/ideas");
const users = require("./routes/users");

//Passport config
require('./config/passport')(passport);

// app.use(express.static(process.cwd() + '/public'));

app.use('/', express.static(path.join(__dirname, 'public')))

app.set("port", (process.env.port || 5000));

app.engine("handlebars", exphbs({ defaultLayout: 'main' }));
app.set("view engine", "handlebars");

// app.use(function(req, res, next) {
//     console.log(Date.now());
//     req.name = "Rajesh";
//     next();
// })

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

//maintain express-session
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));//

app.use(flash());

//global variable
app.use(function(req,res,next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})


// app.use(cors);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

var uri = "mongodb://localhost/vidjot-dev";

mongoose.connect(uri, {
    useMongoClient:true
})
    .then(() => {
        console.log("connected")
    })
    .catch((err) => {
        console.log(err)
    })


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

//use routes
app.use("/ideas",ideas);

app.use("/users",users)

app.listen(app.get('port'), function() {
    console.log(`App running on ${app.get('port')}`)
})