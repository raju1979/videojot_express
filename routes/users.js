const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const passport = require('passport');

const url = require('url');

//Load idea model
require('../models/users');

const mongoose = require('mongoose');

const User = mongoose.model('users');


//User login route

router.get("/login", (req,res) => {
    res.render('users/login');
})


//User register route

router.get("/register", (req,res) => {
    res.render('users/register');
})

//User register

router.post("/register",(req,res) => {
    let errors = [];

    if(req.body.password != req.body.password2){
        errors.push({
            text:'Password do not match'
        })
    }

    if(req.body.password.length < 4){
        errors.push({
            text:'Password must be 4 characters'
        })
    }

    if(errors.length > 0){
        res.render('users/register',{
            errors:errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2,
        })
    }else{
        const newUser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        }

        bcrypt.genSalt(10, (err,salt) => {
            bcrypt.hash(newUser.password,salt, (err,hash) => {
                if(err){

                }else{
                    newUser.password = hash;
                    let user = new User(newUser);
                    user.save()
                        .then(user => {
                            console.log(user)
                            req.flash('success_msg',"You are registerd, now Login")
                            res.redirect("/users/login")
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }                
            });
        });

        // let user = new User(req.body);
        // user.save()
        //     .then(user => {
        //         console.log("success")
        //         res.redirect("/users/login")
        //     })
        //     .catch((err) => {
        //         console.log(err)
        //     })
        
    }
})

module.exports = router;
