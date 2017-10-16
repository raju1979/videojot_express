const LocalStrategy = require('passport-local').Strategy;

const  mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Locad user model
const User = mongoose.model('users');

module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField:'email'},
        (email,password,done) => {
            // console.log(`User Email :: ${email}, User Password :: ${password}`)
            console.log(email)
            User.findOne({
                email:email
            }).then((user) => {
                console.log(user)
                if(user == null){
                    return done(null,false,{'message':'No user found'});
                }else{
                    //match the password
                    bcrypt.compare(password,user.password,(err,isMatched) => {
                        if(err){
                            throw err
                        }
                        if(isMatched){
                            return done(null,user)
                        }else{
                            return done(null,false,{'message':'Password incorrect'});
                        }
                    })
                }
            })
        }
    ))
};//