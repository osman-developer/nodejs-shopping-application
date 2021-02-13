const mongoose = require('mongoose');
const User = require('../models/user');
const bycrpt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.user_signup = (req, res, next) => {
  //we first check if mail exists if no we continue, we hash the password
  User.find({ email: req.body.email }).exec()
    .then(user => {//the find will return an empty array so we test its size
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'mail exists'
        })
      }
      else {
        //this method will hash the plaintext password and save it, but when trying to check if the password
        //is the same when logging in, the sent password in the login post method will be hashed in a different way
        //hence the hashing of the passwords won't be the same, but there's a package to be used in order to check 
        //if the password was hashed in the same algo and then it tests it and returns true if the password matches
        //but this package will be used in the login post method 
        bycrpt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            })
          }
          else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user.save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: 'User successfully created'
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        })
      }
    })
}

exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    //here it will return an array but ofc we have only 1 user
    .then(user => {
      //this method is to check the email 
      if (user.length < 1) {
        //but this approach isn't the best one because it might fall down for brutal force attacks where the hacker keeps on
        //trying emails until he knows the list of available mails.. also the server might go down.
        // return res.status(404).json({
        //   message:'Mail not found, User doesn\'t exist'
        // });
        //so lets try to send another one which is better
        return res.status(401).json({
          message: 'Authentication failed!'
        });
      }//user[0] to make sure only 1 returned back.. i check the returned password
      bycrpt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Authentication failed!'
          });
        }//check if the result succeeded
        if (result) {//callback is executed once the function is done
          //i will give a token
          const token = jwt.sign({
            email: user[0].email,
            userId: user[0]._id
          },
            process.env.JWT_KEY,
            {
              //this one is for options
              //the token expires in 1h
              expiresIn: "1h"
            });
          return res.status(200).json({
            message: 'Auth successful',
            token: token
            //the token is encoded but not encrypted check jwt.io 
            //we use this token to send it with the client when doing some requests in order to protect the api
          });
        }//if the result returned false so also return auth failed.
        res.status(401).json({
          message: 'Authentication failed!'
        })
      })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        })
    });
};

exports.user_delete_user = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'User deleted'
      });
    }).catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};