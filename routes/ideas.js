const express = require('express');
const router = express.Router();

const url = require('url');

//Load idea model
require('../models/idea');

const mongoose = require('mongoose');

const Idea = mongoose.model('ideas');

router.post("/",(req,res) => {
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

        
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
       new Idea(newUser)
        .save()
        .then(idea => {
            req.flash('success_msg','Video Added');
            res.redirect(url.format({
                pathname:"/ideas",
                query:{
                    ideaTitle:newUser.title,
                    ideaDetail:newUser.details
                }
            }));
        })
        .catch(err => {
            res.send(err)
        })
    }

})

router.get("/add", (req,res) => {
    res.render('ideas/add');
    // console.log('djdj')
})

router.get("/",(req,res) => {
    let newUser = req.query.ideaTitle;
    console.log(newUser);    

    Idea.find({})
        .sort({data:'desc'})
        .exec((err,ideas) => {
            console.log(ideas);
            res.render('ideas/index',{
                ideas:ideas
            });
        })
});//

router.get("/edit/:id", (req,res) => {
    Idea.findOne({_id:req.params.id}, (err,idea) => {
        if(err){
            res.json(err);
        }else{
            if(idea == null){
                res.send("no value found");
            }else{
                console.log(idea)
                res.render('ideas/edit',{
                    data:idea
                });
            }
        }
    })   

    // console.log('djdj')
})

//Edit IDEA
router.put('/:id', (req,res) => {

    Idea.findOne({_id:req.params.id}, (err,idea) => {
        if(err){
            res.json(err);
        }else{
            console.log(idea)
            
                idea.title = req.body.title;
                idea.details = req.body.details;
                idea.save()
                    .then((idea) => {
                        req.flash('success_msg','Video Idea Edited');
                        res.redirect("/ideas")
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            
        }
    })

});

//Delete IDEA
router.delete('/:id',(req,res) => {

    Idea.findOne({_id:req.params.id}, (err,idea) => {
        if(err){
            res.json(err);
        }else{
            idea.remove()
                .then(() => {
                    req.flash('success_msg','Video Idea removed');
                    console.log('deleted')
                    res.redirect("/ideas")
                })
            
        }
    })

});//


module.exports = router;