/**
 * Created by hli60 on 13/08/17.
 */

var RSVP = require('rsvp');
const Users = require('../models/user.server.model.js');

exports.createUser = function (req, res) {
    let user = req.body.user;

    if(user == undefined){
        res.status(400).send('Malformed request');
    }

    let data = {
        "name" : user.username,
        "pwd": req.body.password,
        "location" : user.location,
        "email" : user.email
    };

    Users.insert(data, function (err, result) {
        if(err){
            if(err.message == 'existed'){
                res.status(403).send('User name has been occupied');
            }else {
                res.status(400).send('Malformed request');
            }
        }else{
            res.status(200).json(result);
        }
    });

};

exports.list = function(req, res){
    Users.getAll(function (result) {
        res.json(result);
    });

};

exports.login = function (req, res) {

    let data = {
        "name" : req.body.username,
        "pwd": req.body.password,
    };
    console.log(data);
    Users.login(data, function (err, result) {
        if(err){
            if(err.message==400){
                res.status(400).send('Invalid username/password supplied');
            }
            else if(err.message == 'invisible'){
                res.status(400).send('User has been deleted');
            }else if(err.message == 'login'){
                res.status(400).send('login already');
            }else{
                res.status(400).send('Malformed request');
            }
        }else{
            res.status(200).json(result);
        }
    });
};

exports.logout = function (req, res) {
    let token = req.get('X-Authorization');
    user.log_out(token, function (err, result) {
        if(err){
            res.status(400).send('Invalid username/password supplied');
        }else{
            res.status(200).send(result);
        }
    });
};

exports.getUser = function (req, res) {

    let userId = parseInt(req.params.userId);

    user.getOne(userId, function (err, rows) {
        if(err){
            if(err.message == 404){
                res.status(404).send('User not found');
            }else{
                res.status(400).send('Invalid id supplied');
            }
        }else{
            res.status(200).json(rows);
        }
    });


};

exports.update_user = function (req, res) {
    let token = req.get('X-Authorization');
    let decoded = jwt.decode(token, '123456789');
    let login_id = decoded.iss;
    let user_id = parseInt(req.params.user_id);
    let user_name = req.body.user.username;
    let location = req.body.user.location;
    let email = req.body.user.email;
    let password = req.body.password;
    let data = {
        "login_id": login_id,
        "user_id": user_id,
        "user_name": user_name,
        "location": location,
        "email": email,
        "password": password
    }
    user.update_user_by_id(data, function (err, result) {
        if(err){
            if(err.message==403){
                res.status(403).send('Forbidden - account not owned');
            }else if(err.message ==404){
                res.status(404).send('User not found');
            }else if(err.message =='sameuser'){
                res.status(400).send('User name has been occupied');
            }else{
                res.status(400).send('Malformed request');
            }
        }else{
            res.status(200).send(result);
        }
    });
};

exports.delete_user = function (req, res) {
    let token = req.get('X-Authorization');
    let decoded = jwt.decode(token, '123456789');
    let login_id = decoded.iss;
    let user_id = parseInt(req.params.user_id);
    user.delete_user_by_id(login_id, user_id, function (err, result) {
        if(err){
            if(err.message == 403){
                res.status(403).send('Forbidden - account not owned');
            }else if(err.message==404){
                res.status(404).send('User not found');
            }else if(err.message == 'lastcreator'){
                res.status(400).send('Cannot delete user because it is last creator of project');
            }else{
                res.status(400).send('Malformed request');
            }
        }else{
            res.status(200).send(result);
        }
    });
};

// exports.list = function(req, res){
// User.getAll(function (result) {
// res.json(result);
// });

// };

// exports.register = function (req, res) {
// // console.log("req",req.body);
// // //var today = new Date();
// // var users={
// // "name":req.body.name,
// // "email":req.body.email,
// // "password":req.body.password,
// // "location": req.body.location,
// // "isCreator": req.body.isCreator,
// // "isBacker": req.body.isBacker,
// // "token": req.body.token
// // //  "created":today,
// // }
// // User.insert(values, function (result) {
// // res.json(result);
// // });
// };

// exports.read = function (req, res) {
// let userId = req.params.userId;
// User.getOne(userId, function (result) {
// res.json(result);
// });
// };

// exports.update = function (req, res) {
// let userName = req.body.username.toString();
// let values = [[userName]];
// let userId = req.params.userId;
// User.alter(userId, userName, function (result) {
// res.json(result);
// });
// };

// exports.delete = function (req, res) {
// let userId = req.params.userId;
// User.remove(userId, function (result) {
// res.json(result);
// });
// };

// var getJSON = function(url) {
// console.log("1");
// var promise = new RSVP.Promise(function(resolve, reject){

// console.log("2");


// return promise;});
// };

// exports.logIn = function (req, res) {
// console.log("3");
// return getJSON("/users/login").then(function(json) {
// return console.log("4");
// //return json.post;
// }).then(function(post) {
// console.log(post);
// });
// };

// exports.logOut = function (req, res) {

// };