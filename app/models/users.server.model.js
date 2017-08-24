/**
 * Created by hli60 on 13/08/17.
 */
const db = require('../../config/db.js');
var RSVP = require('rsvp');
const jwt = require('jwt-simple');
const moment = require('moment');

//if usename has existed, you can not create user;
exports.insert = function (data, done) {
    let name = data['name'];
    let pwd = data['pwd'];
    let location = data['location'];
    if (location != null) {
        location = location.toString();
    }
    let email = data['email'];
    if (email != null) {
        email = email.toString();
    }
    let values = [name, pwd, location, email];
    let sql = 'INSERT INTO Users (name, password, location,email) VALUES (?,?,?,?);';
    db.get().query('SELECT name FROM Users;', function (err ,result) {
        if(err){
            console.log(err);
            done(err, null);
        }else{
            //check if the username has been occupied.
            var find = 0;
            for(let res of result){
                if(res.name == name){
                    find = 1;
                    break;
                }
            }
            if(find == 1){
                return done(new Error('existed'), null);
            }else{
                db.post().query(sql, values, function (err, result) {
                    if (err) {
                        console.log(err);
                        return done(err,null);
                    } else {
                        console.log(result);
                        db.get().query('SELECT name from Users ORDER BY id DESC LIMIT 1;', function (err, result) {
                            if(err){
                                return done(err, null);
                            }
                            else{
                                let userIdStr = new String(result[0].id);
                                let userId = parseInt(userIdStr);
                                return done(null,userId);
                            }
                        });
                    }
                });
            }
        }
    });

}




var loadUserByUserName = function(data, done){
    let name = data['name'];
    let pwd = data['pwd'];
    console.log(data);
    var promise = new RSVP.Promise(function(resolve, reject){
            db.get().query('SELECT * FROM users WHERE name =?;', data['name'], function(err, rows){
                if(err){
                    console.log(err);
                    reject(err);
                    done();
                    return;
                }else{
                    if(rows[0]==undefined){
                        console.log("11");
                        //done();
                        return reject("this is error", done);
                    }else if(new String(rows[0].password)!= pwd){
                        return reject("wroing passowrd", done);
                    }else{
                        resolve(rows[0], done);
                    }
                }
            });
        }

    );
    return promise;
}


exports.login = function (data, done) {

    console.log(data);
    console.log("2");
    return loadUserByUserName(data, done).then(function(user){

        console.log("3");
        var userId = parseInt(user.id);
        var expires = moment().add(30, 'days').valueOf();
        token = jwt.encode({
            iss: userId,
            exp: expires,
        }, '123456789', null);
        db.post().query("update users set token = ? where id = ?;", [token, userId], function (err, result) {

            if (err){
                console.log("5");
                console.log(err);
                return done(new Error("login"), null);
            }else{
                console.log("6");
                let tokenJson = {
                    "id": userId,
                    "token":token
                }
                console.log(token);
                return done(null,tokenJson);
            }
        });

    }).catch(function(err) {
        return done(null,err);
        //return  console.log(err);
        // since no rejection handler was passed to the
        // first `.then`, the error propagates.
    });


}

//delete token info from table response
exports.log_out = function (token, done) {
    db.delete().query('DELETE FROM Response WHERE token = ?;', token, function (err, result) {
        if(err){
            console.log(err);
            return done(err, null);
        }else{
            return done(null,'OK');
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




exports.update_user_by_id = function (data, done) {
    let login_id = data['login_id'];
    let user_id = data['user_id'];
    let user_name =data['user_name'];
    let location = data['location'];
    let email = data['email'];
    let password = data['password'];
    if(login_id!=user_id){
        return  done(error403, null);
    }else{
        db.get().query('SELECT * FROM Users;', function (err, result) {
            console.log(result);
            if(err){
                console.log(err);
                return done(err, null);
            }else{
                if(result[0]==undefined){
                    return done(error404);
                }else{
                    let flag = 0;
                    for (let res of result){
                        if(res.user_name == user_name){
                            flag = 1;
                        }
                    }
                    //can not set same user name
                    if(flag == 1){
                        return done(new Error('sameuser'), null);

                    }else{
                        db.put().query('UPDATE Users SET user_name=?,password=?,location=?,email=? WHERE user_id = ?', [user_name, password, location, email,user_id], function (err, result) {
                            if(err){
                                console.log(err);
                                return done(err, null);
                            }else{
                                return done(null, 'OK');
                            }
                        });
                    }
                }
            }
        });
    }
}



exports.delete_user_by_id = function (login_id, user_id, done) {
    if(login_id != user_id){
        return done(error403, null);
    }else{
        db.get().query('SELECT * FROM Creator WHERE creator_id = ?;', user_id, function (err, result) {
            if(err){
                console.log(err);
                return done(err, null);
            }else{
                //if user id did not create a project, then delete pledge if did and modify the current pledge
                //and number of backers in project, delete user, logout and so on.
                if(result[0] == undefined){
                    delete_and_modify(user_id, function (err, result1) {
                        if(err){
                            console.log(err);
                            return done(err, null);
                        }else{
                            return done(null, result1);
                        }
                    });
                }else {
                    // collect all projects created by user, and traverse all creators in the these projects to check
                    //if the user is the last creator of any project.
                    //if yes, return 'last creator, cannot be deleted',
                    //else, delete user, call delete_and_modify function which has been introduced as above.
                    let flag1 = 0;
                    let count = 0;
                    for(let res of result){
                        db.get().query('SELECT COUNT(*) FROM Creator WHERE pro_id = ?', res.pro_id, function (err, result2) {
                            if(err){
                                console.log(err);
                            }else{
                                for(let res2 of result2){
                                    if(res2['COUNT(*)'] == 1){
                                        flag1 = 1;
                                        break;
                                    }
                                }
                                if(flag1 == 1){
                                    return done(new Error('lastcreator'), null);
                                }else{
                                    if(count == result.length - 1){
                                        delete_and_modify(user_id, function (err, result1) {
                                            if(err){
                                                console.log(err);
                                                return done(err, null);
                                            }else{
                                                return done(null, result1);
                                            }
                                        });
                                    }
                                    count++;

                                }


                            }
                        });
                    }
                    console.log(flag1);

                }
            }
        });
    }
}


var delete_and_modify = function (user_id, done) {
    db.delete().query('DELETE FROM RESPONSE WHERE user_id = ?;DELETE FROM Creator WHERE creator_id = ?;UPDATE Users SET status = 0 WHERE user_id = ?;', [user_id, user_id, user_id], function (err, result) {
            if (err) {
                console.log(err);
                return done(err, null);

            } else {
                db.get().query('SELECT amount, pro_id FROM Pledge WHERE backer_id =?;', user_id, function (err, result) {
                    if (err) {
                        console.log(err);
                        return done(err, null);
                    } else {
                        if (result[0] != undefined) {
                            var amount = result[0].amount;
                            var pro_id = result[0].pro_id;
                            db.get().query('SELECT current_pledge, num_backers FROM Project WHERE pro_id =?;', pro_id, function (err, result) {
                                if (err) {
                                    console.log(err);
                                    return done(err);
                                } else {
                                    let current_pledge = result[0].current_pledge - amount;
                                    let num_backers = result[0].num_backers - 1;
                                    //update current_pledge, number of backers, delete pledge
                                    db.put().query('UPDATE Project SET current_pledge = ?, num_backers = ? WHERE pro_id = ?;' +
                                        'DELETE FROM Pledge WHERE backer_id = ?;', [current_pledge, num_backers, pro_id, user_id], function (err, result) {
                                        if (err) {
                                            console.log(err);
                                            return done(err, null);
                                        } else {
                                            return done(null, 'OK');
                                        }
                                    });
                                }
                            });

                        }
                        else {
                            return done(null, 'OK');
                        }
                    }
                });

            }

        }
    );
}

// exports.insert = function (result, done) {
// console.log(result.name + parseInt(result['isCreator']));
// db.post().query('INSERT INTO users (name, email, password, location, isCreator, isBacker, token) VALUES (?,?,?,?,?,?,?);',
// [result['name'], result['email'],result['password'],result['location'],parseInt(result['isCreator']),parseInt(result['isBacker']),result['token']],
// function (err, result) {
// if (!err){
// return done ({"SUCCESS" : "success insert a user"});
// } else {
// return done (err);
// }
// });
// };

// exports.logIn = function () {
// //db.post().query()
// return null;
// };

// exports.logOut = function () {
// //db.post().query()
// return null;
// };

// exports.getOne = function (done) {
// // //console.log(result);
// // db.get().query('select * from users;',  function (err, done) {
// // if (err){
// // return err;
// // }

// // return done(rows);
// // });
// };

// var getAllTest = function(done) {
// var promise = new RSVP.Promise(function(resolve, reject){
// db.get().query('select * from users;', function(err, rows){
// done();
// resolve();
// });
// console.log("test2");

// });
// console.log("test5");
// return promise;
// };

// exports.getAll = function (done) {
// console.log("test3");
// return getAllTest(done).then(function(results){

// //console.log(results);
// //return result;
// return  results;
// });
// };

// exports.alter = function () {
// //db.put().query()
// return null;
// };

// exports.remove = function () {
// //db.delete().query()
// return null;
// };
