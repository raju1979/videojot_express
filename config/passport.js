const LocalStrategy = require('passport-local').Strategy;

const  mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Locad user model
const User = mongoose.model('users');

module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField:'email'},
        (email,password,done) => {
            // console.log(`User Email :: ${email}, User Password :: ${password}`)
            User.findOne({
                email:email
            }).then((err,user) => {
                if(user == null){
                    return done(null,false,{'message':'No user found'});
                }
            })
        }
    ))
};//