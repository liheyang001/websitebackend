/**
 * Created by hli60 on 13/08/17.
 */
const db = require('../../config/db.js');
var RSVP = require('rsvp');
const jwt = require('jsonwebtoken');
const moment = require('moment');

//get user info by user id
exports.getUserByUserId = function (userId) {
	
	return new RSVP.Promise(function(resolve, reject){
		
	return db.get().query('SELECT id, name, location, email FROM Users WHERE id =?;',userId, function (err, result) {
        if(err){
            console.log(err);
            return reject(err);
        }else{
			return resolve(result);
        }
    });
	}); 
}

//check user name
exports.checkUserName = function(userName){
	return new RSVP.Promise(function(resolve, reject){
    db.get().query('select count(*) AS existName from Users where name = ?;', userName[1], function(err, rows){
		  if(err){
                    console.log(err);
                   return reject(err);
                }else{
			  resolve(rows[0]);
                }
    });
}
);
}

exports.insert = function(data){
	let userName = data['username'];
    let password = data['password'];
    let location = data['location'];
    if (location != null) {
        location = location.toString();
    }
    let email = data['email'];
    if (email != null) {
        email = email.toString();
    }
    let values = [userName, password, location, email];
	return new RSVP.Promise(function(resolve, reject){
		db.get().query('INSERT INTO Users (name, password, location,email) VALUES (?,?,?,?);', values, function (err, rows) {
			if (err) {
				console.log(err);
				return reject(err);
			} else {
				return resolve(rows);
			}
		});
	});
};

// //add user information into database
// exports.insert = function (data, done) {
    // let userName = data['username'];
    // let password = data['password'];
    // let location = data['location'];
    // if (location != null) {
        // location = location.toString();
    // }
    // let email = data['email'];
    // if (email != null) {
        // email = email.toString();
    // }
    // let values = [userName, password, location, email];
	
	// return checkUserName(userName, done).then(function(){
		 // db.post().query('INSERT INTO Users (name, password, location,email) VALUES (?,?,?,?);', values, function (err, result) {
                    // if (err) {
                        // console.log(err);
                        // return done(err,null);
                    // } else {
                        // console.log(result);

                     // return done(null,result.insertId);
                            // }
                        // });
                // }).
				// catch(function(err) 
				// {
	// return done(null,err);
// });
// }

// //add user information into database
// exports.insert = function (data, done) {
    // let userName = data['username'];
    // let password = data['password'];
    // let location = data['location'];
    // if (location != null) {
        // location = location.toString();
    // }
    // let email = data['email'];
    // if (email != null) {
        // email = email.toString();
    // }
    // let values = [userName, password, location, email];
	
	// return checkUserName(userName, done).then(function(){
		 // db.post().query('INSERT INTO Users (name, password, location,email) VALUES (?,?,?,?);', values, function (err, result) {
                    // if (err) {
                        // console.log(err);
                        // return done(err,null);
                    // } else {
                        // console.log(result);

                     // return done(null,result.insertId);
                            // }
                        // });
                // }).
				// catch(function(err) 
				// {
	// return done(null,err);
// });
// }

//main promise function
exports.loadUserByUserName = function(data){
	let name = data['name'];
    let pwd = data['pwd'];
	return new RSVP.Promise(function(resolve, reject){
    db.get().query('SELECT * FROM Users WHERE name =?;', data['name'], function(err, rows){
		  if(err){
                    console.log(err);
                    
                    return reject(err);
                }else{
					console.log('2222');
                    return resolve(rows);
                }
    });
});
}

//lon in user using token
exports.login = function (myToken, userId) {

return new RSVP.Promise(function(resolve, reject){
console.log(userId);
               
				  return db.post().query('update Users set token = ? where id = ?;', [myToken, userId], function (err, result) {

                    if (err){
                        //console.log(err);
                        return reject(err);
                    }else{
                        let tokenJson = {
                            "id": userId,
                            "token":myToken
                        }
						//console.log(myToken);
                        //return resolve(tokenJson, done);
						return resolve(tokenJson);
                    }
          

	});
});
}

// //lon in user using token
// exports.login = function (data, done) {

// console.log(data);
	// return loadUserByUserName(data, done).
		// then(function(user){
                // var userId = parseInt(user.id);
                // //setup an expire time
                // var expires = moment().add(30, 'days').valueOf();
                // //create token
                // var myToken = jwt.sign({ user: user.id },
                                      // 'secret',
                                     // { expiresIn: 24 * 60 * 60*60 });
									 // console.log(myToken);
				  // db.post().query('update users set token = ? where id = ?;', [myToken, userId], function (err, result) {

                    // if (err){
                        // console.log(err);
                        // return done(err, null);
                    // }else{
                        // let tokenJson = {
                            // "id": userId,
                            // "token":myToken
                        // }
						// console.log(myToken);
                        // //return resolve(tokenJson, done);
						// return done(null,tokenJson);
                    // }
                // });

// }).catch(function(err) {
	// return done(null,err);
// });
// }

//log out user
exports.logOut = function(username){
	return new RSVP.Promise(function(resolve, reject){
		db.get().query('update Users set token = ? where name = ?;', ['', username], function (err, rows) {
			if (err) {
				console.log(err);
				return reject(err);
			} else {
				return resolve(rows);
			}
		});
	});
};

//update user information
exports.updateUserById = function(data){
	// let login_id = data['login_id'];
    let userId = data['userId'];
    let userName =data['userName'];
    let location = data['location'];
    let email = data['email'];
    let password = data['password'];
	return new RSVP.Promise(function(resolve, reject){
		db.get().query('UPDATE Users SET name=?,password=?,location=?,email=? WHERE id = ?', [userName, password, location, email,userId], function (err, rows) {
			if (err) {
				console.log(err);
				return reject(err);
			} else {
				return resolve(rows);
			}
		});
	});
};

// exports.updateUserById = function (data, done) {
   // // let login_id = data['login_id'];
    // let userId = data['userId'];
    // let userName =data['userName'];
    // let location = data['location'];
    // let email = data['email'];
    // let password = data['password'];
// return checkUserName(userName, done).
		// then(function(user){
                    // db.put().query('UPDATE Users SET name=?,password=?,location=?,email=? WHERE id = ?', [userName, password, location, email,userId], function (err, result) {
                        // if(err){
                            // console.log(err);
                            // return done(err, null);
                        // }else{
                            // return done(null, 'OK');
                        // }
                    // });
// }).catch(function(err) {
	// return done(null,err);
// });
// }

//delete user
exports.deleteUserById = function(userId){
	return new RSVP.Promise(function(resolve, reject){
		db.get().query('update Users set isDeleted = 1 WHERE id = ?;', userId, function (err, rows) {
			if (err) {
				console.log(err);
				return reject(err);
			} else {
				return resolve(rows);
			}
		});
	});
};

