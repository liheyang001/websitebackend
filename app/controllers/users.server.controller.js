/**
 * Created by hli60 on 13/08/17.
 */

const Users = require('../models/users.server.model.js');

const jwt = require('jwt-simple');

const fs = require('fs');

exports.createUser = function (req, res) {
    var username = req.body.username.toString();
    var password = req.body.password.toString();
    var location = req.body.location.toString();
    var email = req.body.email.toString();
    var info = {
        "username": username,
        "password": password,
        "location": location,
        "email": email
    };
    Users.insert(info, function (err,rows) {
        if (err){
            return err;
        } else {
            res.status(201).json(rows);
        }
    });
};

exports.getUserDetails = function (req, res) {
    var userId = req.params.userId;
    //console.log(userId);
    Users.getOne(userId, function (err,rows) {
        if (err) {
            if (err.message == 400) {
                res.status(400).send('Invalid id supplied');
            } else if (err.message == 404) {
                res.status(404).send('User not found');
            }
        }
        else {
            res.status(200).json(result);
        }
    });
};


exports.deleteUser = function (req, res) {
    var userId = req.params.userId.toString();
    var token = req.get('X-Authorization');
    var decode = jwt.decode(token, '123456789');
    //var logInId = decode.iss;
    Users.remove(userId, function (err, rows) {
        if(!err){
            res.status(200).send(rows);
            console.log('User deleted');
        }
        else{
            if(err.message == 401){
                res.status(401).send('Unauthorized - not logged in');
            } else if (err.message == 403) {
                res.status(403).send('Forbidden - account not owned');
            } else {
                res.status(404).send('User not found');
            }
        }
    });
};

exports.userLogIn = function (req, res) {
    var userName = req.query.username;
    var password = req.query.password;
    Users.logIn(userName, password, function (err,rows) {
        if(err){
            if(err.message == 400){
                res.status(400).send('Invalid username/password supplied');
            }
        } else {
            res.status(200).json(rows);
        }
    });
};

exports.userLogOut = function (req, res) {
    var token = req.get('X-Authorization');
    Users.logOut(token, function (err, rows) {
        if(err){
            if(err.message == 401){
                res.status(401).send('Unauthorized - already logged out');
            }
        } else {
            res.status(200).send(rows);
        }
    });
};

exports.updateUser = function (req, res) {
    var userId = req.params.userId.toString();
    var decode = jwt.decode(token, '123456789');
    var logInId = decode.iss;
    var token = req.get('X-Authorization');
    var username = req.body.username.toString();
    var password = req.body.password.toString();
    var location = req.body.location.toString();
    var email = req.body.email.toString();
    var info = {
        "username": username,
        "password": password,
        "location": location,
        "email": email
    };
    Users.alter(userId, token, function (err,rows) {
        if (err) {
            if (err.message == 401) {
                res.status(401).send('Unauthorized - not logged in');
            } else if (err.message == 403) {
                res.status(403).send('Forbidden - account not owned');
            } else {
                res.status(404).send('User not found');
            }
            res.json(rows);
        }
    });
};

