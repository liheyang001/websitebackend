/**
 * Created by hli60 on 13/08/17.
 */

const db = require('../../config/db.js');
const Users = require('../models/user.server.model.js');

var RSVP = require('rsvp');
const jwt = require('jsonwebtoken');
const moment = require('moment');

var  algorithm = 'aes-256-ctr';
var privateKey = '37LvDSm4XvjYOh9Y';

var error401 = new Error('401');
var error403 = new Error('403');
var error404 = new Error('404');

//check user information
exports.checkUsers = function(creators){
	//using promise function
	return new RSVP.Promise(function(resolve, reject){
		db.get().query('SELECT id, name FROM Users WHERE (id, name) in (?);', [creators], function(err, rows){
		  if(err){
                    return reject(err);
                }else{
					return resolve(rows[0]);
				}
		});
});
}


exports.insertProject = function(project){
	return new RSVP.Promise(function(resolve, reject){
                   return db.post().query('INSERT INTO Project (Title, Subtitle, ImageUri, Description, Target) VALUES (?,?,?,?,?)', project, function (err, result) {
                        if(err){
                            return reject(err);
                        }else{
                            return resolve(result['insertId']);
                        }
                    });
}

);

}

exports.insertProjectCreators = function(projectCreators){
	return new RSVP.Promise(function(resolve, reject){
                   return db.post().query('INSERT INTO ProjectCreators (UserId, ProjectId) VALUES (?,?);', projectCreators, function (err, result) {
                        if(err){
                            return reject(err);
                        }else{
                            return resolve();
                        }
                    });
}

);

}

exports.insertRewards = function(rewardsData){
	return new RSVP.Promise(function(resolve, reject){
                   return db.post().query('INSERT INTO Reward (Amount, Description,projectId) VALUES (?);', [rewardsData], function (err, result) {
                        if(err){
                            return reject(err);
                        }else{

                            return resolve();
                        }
                    });
			});

}

exports.viewAllProjects = function (startIndex, count) {
    return new RSVP.Promise(function(resolve, reject){
		return db.get().query('select * from Project where isOpen = true order by Id limit ?, ?;', [parseInt(startIndex), parseInt(count)], function (err, result) {
            if (err) {
                return reject(err);
            } else {
                return resolve(result);
            }
        });
	});
}



exports.checkProjectCreator = function (userId, projectId) {
	
	return new RSVP.Promise(function(resolve, reject){
		
	return db.get().query('select ProjectId from ProjectCreators where UserId = ? and ProjectId = ?;',
	[userId, projectId], function (err, result) {
        if(err){
            return reject(err);
        }else{
			return resolve(result);
        }
        });
	});
}

exports.updateProjectById = function (isOpen, projectId) {
	
	return new RSVP.Promise(function(resolve, reject){
		
	return db.get().query('UPDATE Project SET IsOpen = ? WHERE Id = ?', [isOpen, projectId], function (err, result) {
        if(err){
            return reject(err);
        }else{
			return resolve(result);
        }
	});
	});
}


exports.getImagePath = function (projectId) {
	return new RSVP.Promise(function(resolve, reject){
		
	return db.get().query('select imageUri from Project WHERE Id = ?', [projectId], function (err, result) {
        if(err){
            return reject(err);
        }else{
			return resolve(result);
        }
	});
	});
}

exports.updateImagePath = function (imagePath, projectId) {
	return new RSVP.Promise(function(resolve, reject){
		
	return db.get().query('UPDATE Project SET imageUri = ? WHERE Id = ?', [imagePath, projectId], function (err, result) {
        if(err){
            return reject(err);
        }else{
			return resolve(result);
        }
	});
	});
}



exports.IsProjectOpen = function (projectId) {
	
	return new RSVP.Promise(function(resolve, reject){
		
 db.get().query('select Project.IsOpen from Project where Id = ?;',
	[projectId], function (err, result) {
        if(err){
            return reject(err);
        }else{
            return resolve(result);
        }
       });
	});
}

exports.InsertPledge = function (data) {
	
	let projectId = data['ProjectId'];
    let amount = data['Amount'];
    let anonymous = data['isAnonymous'];
    let authToken = data['authToken'];
    let userId = data['UserId'];
	
	return new RSVP.Promise(function(resolve, reject){
		db.put().query('INSERT INTO Pledge (BackerId, ProjectId,Amount, AuthToken, IsAnonymous) VALUES (?,?,?,?,?);', [userId, projectId, amount, authToken, anonymous], function (err, result) {
        if(err){
            return reject(403);
        }
		else{
			return resolve(result);
        }
});
			
        });
}

exports.getProjectById = function(projectId){
	return new RSVP.Promise(function(resolve, reject){
		db.get().query('SELECT * FROM Project WHERE IsOpen = 1 and Id = ?', projectId, function (err, rows) {
			if (err) {
				return reject(err);
			} else {
				return resolve(rows);
			}
		});
	});
};

exports.getCreatorsByProjectId = function(projectId){
	return new RSVP.Promise(function(resolve, reject){
		db.get().query('select distinct Users.id, Users.name from Users inner join ProjectCreators on Users.id = ProjectCreators.UserId where ProjectCreators.ProjectId = ?;', projectId, function (err, rows) {
			if (err) {
				return reject(err);
			} else {
				return resolve(rows);
			}
		});
	});
};

exports.getRewardsByProjectId = function(projectId){
	return new RSVP.Promise(function(resolve, reject){
		db.get().query('select * from Reward inner join Project on Reward.ProjectId = Project.Id where Project.Id = ?;', projectId, function (err, rows) {
			if (err) {
				return reject(err);
			} else {
				return resolve(rows);
			}
		});
	});
};

exports.getBackersByProjectId = function(projectId){
	return new RSVP.Promise(function(resolve, reject){
		db.get().query('select Users.name, sum(Pledge.Amount) as Amount from Pledge inner join Users on Pledge.BackerId = Users.id  where Pledge.ProjectId = ? group by Users.name;', projectId, function (err, rows) {
			if (err) {
				return reject(err);
			} else {
				return resolve(rows);
			}
		});
	});
};

exports.getCurrentPledgedByProjectId = function(projectId){
	return new RSVP.Promise(function(resolve, reject){
		db.get().query('select sum(Pledge.Amount) as currentPledged from Pledge inner join Project on Pledge.ProjectId = Project.Id where Project.Id = ?;', projectId, function (err, rows) {
			if (err) {
				return reject(err);
			} else {
				return resolve(rows);
			}
		});
	});
};

exports.getnumberOfBackersByProjectId = function(projectId){
	return new RSVP.Promise(function(resolve, reject){
		db.get().query('select count(distinct BackerId) as numberOfBackers from Pledge inner join Project on pledge.ProjectId = Project.Id where Project.Id = ?;', projectId, function (err, rows) {
			if (err) {
				return reject(err);
			} else {
				return resolve(rows);
			}
		});
	});
};

exports.ViewProjectRewardsById = function(projectId){
	return new RSVP.Promise(function(resolve, reject){
		db.get().query('select * from Reward where ProjectId = ?;', projectId, function (err, rows) {
			if (err) {
				return reject(err);
			} else {
				return resolve(rows);
			}
		});
	});
};

exports.updateProjectRewardsById = function (rewards) {
	return new RSVP.Promise(function(resolve, reject){
		var results = [];
	for(let reward of rewards){
		db.get().query('UPDATE Reward SET Amount = ?, Description = ?  WHERE Id = ? and ProjectId = ?', [reward[1], reward[2], reward[0], reward[3]], function (err, result) {
			if(err){
				return reject(err);
			}else{
				results.push(result);
			}
		});
	}
	return resolve(results);	
	});
};
