/**
 * Created by hli60 on 13/08/17.
 */

const Users = require('../models/user.server.model.js');
var RSVP = require('rsvp');
const jwt = require('jsonwebtoken');
const moment = require('moment');

exports.createUser = function (req, res) {
    let user = req.body.user;

    if(user == undefined){
        res.status(400).send('Malformed request');
    }

    let data = {
        "username" : user.username,
        "password": req.body.password,
        "location" : user.location,
        "email" : user.email
    };
	
	Users.checkUserName(user.username).
	then(function(result){
		if (result['existName'] > 0){
						console.log(result[0]);
						throw "this user name is used";
					}else{
						return Users.insert(data);
                    }
		
	}).
	then(function(result){
		if(result.affectedRows == 1)
		res.status(200).json('OK');
	}).
	catch(function(err){
		console.log(err);
		  if(err.message == 'existed'){
                res.status(403).send('User name has been occupied');
            }else {
                res.status(400).send('Malformed request');
            }
	});
};

exports.login = function (req, res) {

	let data = {
        "name" : req.body.username,
        "pwd": req.body.password
    };
									 
	Users.loadUserByUserName(data).
	then(function(user){
		//console.log(user);
		if(user[0]==undefined){
			throw "this is error";
		}else if(new String(user[0].password)!= data.pwd){
			throw "wroing passowrd";
        }else{
			var userId = parseInt(user[0].id);
                //setup an expire time
                var expires = moment().add(30, 'days').valueOf();
                //create token
                var myToken = jwt.sign({ user: userId },
                                      'secret',
                                     { expiresIn: 24 * 60 * 60*60 });
									 //console.log(myToken);
									 //console.log(userId);
									 

			return Users.login(myToken, userId);
		}
	}).
	then(function(result){
		 res.status(200).send(result);
	}).
	catch(function(err){
		if(err){
                res.status(400).send('Invalid username/password supplied');
            }

	});
}

exports.logOut = function (req, res) {
    Users.logOut(req.body.username).
	then(function(result){
		 res.status(200).send('OK');
	}).
	catch(function(err){
		res.status(401).send('Unauthorized - already logged out');
	});
};

exports.getUserByUserId = function (req, res) {
      let userId = parseInt(req.params.id);
	 
	Users.getUserByUserId(userId).then(function(result){
		if(result[0]==undefined){
			res.status(404).send('User not found');
        }else {
            let isDeleted = result[0].isDeleted;
			if (isDeleted == 1) {
                res.status(400).send('Invalid id supplied');
            }else{
				let userId = result[0].id;
                let Name = result[0].name;
                let location = result[0].location;
                let email = result[0].email;
                let userJson = {
                    "id": userId,
                    "username": Name,
                    "location": location,
                    "email": email
                }
                res.status(200).json(result);   
            }
		}
	}).catch(function(err) {
		res.status(400).send('Invalid id supplied');
	});
};

exports.updateUser = function (req, res) {
    let userId = parseInt(req.params.id);
    let userName = req.body.user.username;
    let location = req.body.user.location;
    let email = req.body.user.email;
    let password = req.body.password;
    let data = {
        "userId": userId,
        "userName": userName,
        "location": location,
        "email": email,
        "password": password
    }

    Users.updateUserById(data).
	then(function(result){
        if(result.affectedRows == 1)
            res.status(200).json('OK');
	}).
	catch(function(err){
		if(err.message==403){
                res.status(403).send('Forbidden - account not owned');
            }else if(err.message ==404){
                res.status(404).send('User not found');
            }else{
                res.status(401).send('Unauthorized - not logged in');
            }	
	});
};

exports.deleteUser = function (req, res) {
    let userId = parseInt(req.params.id);
	Users.deleteUserById(userId).
	then(function(result){
        if(result.affectedRows == 1)
            res.status(200).json('OK');
		res.status(200).send('OK');
	}).
	catch(function(err){
		 if(err.message == 403){
                res.status(403).send('Forbidden - account not owned');
            }else if(err.message==404){
                res.status(404).send('User not found');
            }else{
                res.status(400).send('Malformed request');
            }
	});
};
