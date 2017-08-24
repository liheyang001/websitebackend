/**
 * Created by hli60 on 13/08/17.
 */

const db = require('../../config/db.js');
const jwt = require('jwt-simple');
const fs = require('fs');
const async = require('async');
const moment = require('moment');


var err401 = new Error('401');
var err403 = new Error('403');
var err404 = new Error('404');
err401.setStatus = 401;
err403.setStatus = 403;
err404.setStatus = 404

exports.insert = function (userInput, done) {
    var username = userInput['username'];
    var password = userInput['password'];
    var location = userInput['location'];
    var email = userInput['email'];
    var info = [username, password, location, email];
    db.post().query('INSERT INTO users (userName, userPassword, userLocation, userEmail) VALUES (?);', [info], function (err, rows) {
        if (!err){
            db.get().query('SELECT userId FROM users ORDER BY userId DESC LIMIT 1;', function (err, rows) {
                if (!err){
                    return done(null,rows);
                } else {
                    return done(err);
                }
            });
        } else {
            return done(err);
        }
    });
};

exports.logOut = function (token, done) {
    db.delete().query('DELETE FROM logInResponse WHERE logInToken = ?;', token, function (err, rows) {
        if(!err){
            return done(null, 'OK');
        } else {
            return done(err401);
        }
    });
};


exports.logIn = function (userName, password, done) {
    /*
    var Promise = require("bluebird");
    
    function retrieveUser() {
        db.get().query("SELECT * FROM users WHERE userName = ?;"), userName, function (err, rows) {
            if (!err){
                if (rows[0] == undefined){
                    return done(err404, null);
                }else{
                }
            }
        }
    }
    db.post().query()
    return null;
};
*/

    let err400 = new Error('400');
    async.waterfall([
        function task1(callback) {
        //console.log(userName);
            db.get().query("SELECT * FROM users WHERE userName = ?;", userName, function (err, rows) {
                if(err){
                    console.log(err);
                    callback(err, null);
                    return;
                }else{
                    if(rows[0]==undefined){
                        callback(err400,null);
                        return;
                    }else if(new String(rows[0].userPassword)!= password){
                        callback(err400,null);
                        return;
                    }else{
                        callback(null, rows[0]);
                    }
                }
            });
        },function task2(user, callback) {
            //create a token;
                var user_id = user.userId;
                var expires = moment().add(30, 'days').valueOf();
                var token = jwt.encode({
                    iss: user_id,
                    exp: expires,
                }, '123456789', null);
                callback(null, user_id, token);
        }
    ],function final(err, user_id, token) {
        if(err){
            return done(err, null);
        }else{
            console.log(token);
            db.post().query("INSERT INTO logInResponse (logInId, logInToken) VALUES (?, ?);", [user_id, token], function (err, rows) {
                if (err){
                    console.log(err);
                }else{
                    let token_json = {
                        "id": user_id,
                        "token":token
                    }
                    return done(null,token_json);
                }
            });

        }
    });

}

exports.getOne = function (userId, done) {
    db.get().query('SELECT userId, userName, userLocation, userEmail FROM users WHERE userId = ?;', userId, function (err, rows) {
        if (!err){
            if (rows[0] == undefined){
                return done(err404, null);
            }
            else{
                var info = {
                    "id" : userId,
                    "username" : rows[0].userName,
                    "location" : rows[0].userLocation,
                    "email" : rows[0].userEmail
                }
                return done(null, info);
                }
            } else {
            return done(err);
        }
    });
};

exports.alter = function () {
    //db.put().query()
    return null;
};

exports.remove = function (userId,done) {
    /*
    db.get().query('SELECT * FROM users WHERE userId = ?;', [userId], function (err, rows) {
        console.log(err);
        console.log(rows);
        if(!err){
            return done(null, rows);
            } else if (rows == []){
            return done(err404, null);
            } else{
            */
            db.delete().query('DELETE FROM users WHERE userId = ?;', [userId], function (err, rows) {
                if(!err){
                    return done(null,rows);
                } else{
                    return done(err);
                }
            });
        }
        /*
    });
};
*/

