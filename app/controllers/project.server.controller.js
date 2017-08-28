/**
 * Created by hli60 on 13/08/17.
 */


const Project = require('../models/project.server.model.js');
const Users = require('../models/user.server.model.js');
var RSVP = require('rsvp');
const fs = require('fs');
const jwt = require('jsonwebtoken');

var decodeToken = function(token){
	
	//console.log(req.get('x-access-token'));
	var info = jwt.verify(token, 'secret');
	//console.log(info);
	return info.user;
     
}

exports.viewAllProjects = function (req, res) {
    var startIndex = req.query.startIndex;
    var count = req.query.count;

	Project.viewAllProjects(startIndex, count).
	then(function(result){
		let projects = [];
        for (let item of result) {
			info = {
				"id" : item.Id,
				"title": item.Title,
                "subtitle" : item.Subtitle,
                "imageUri": item.ImageUri
            };
			projects.push(info);
        }
		res.status(200).json(projects);
	}).
	catch(function(err){
		res.status(400).send(err);
	});
};

exports.createProject = function (req, res) {
    let title = req.body.title;
    let subtitle =req.body.subtitle;
    let desc = req.body.description;
    let imageUri = req.body.imageUri;
    try{
        fs.readFile(uri, "binary");
    }
    catch (err){
        imageUri = "./image/default.jpg";
    };
    let target = req.body.target;
    let creators = req.body.creators;
    if(creators[0] == undefined){
        return res.status(400).send('Malformed project data');
    }
	
    let rewards = req.body.rewards;

    let projectData = [title, subtitle, imageUri, desc, target];
	let projectId = {};
	
	let creatorIdAndNames = [];
	for (let creator of creators) {
        let creatorId = parseInt(creator['id']);
        let creatorName = creator['name'];
        creatorIdAndNames.push([creatorId, creatorName]);
    }

	Project.checkUsers(creatorIdAndNames).
	then(function(){
		return Project.insertProject(projectData);
	}).
	then(function(result){

		let projectId = parseInt(result);

		let creatorNames = [];
			for (let creator of creators) {
				let creatorId = parseInt(creator['id']);
                creatorNames.push(creatorId, projectId);
			}

		Project.insertProjectCreators(creatorNames);
	}).
	then(function(){

		let rewardsData = [];
        if(rewards[0] != undefined) {
            for (let reward of rewards) {
				rewardsData.push(reward['amount'], reward['description'].toString(), parseInt(reward['id']));
            }
        }
		Project.insertRewards(rewardsData);
	}).
	then(function(){
		return res.status(200).json('OK');
	}).
	catch(function(err){
		if(err.message == 401){
            res.status(401).send('Unauthorized - create account to create project');
        }
		else{
			res.status(400).send('Malformed project data');
		}
	});
};


exports.viewProjectDetails = function (req, res) {
    let projectId = req.params.id;
	let currentPledged = 0;
	let numberOfBackers = 0;
	let target = 0;
	let backers = [];
	let creators = [];
	let rewards = [];
	let project = {};

	Project.getRewardsByProjectId(projectId).
	then(function(result){
		//console.log(result[0]);
		if(result[0]==undefined){
			throw 'No Reward found';
		}
		else{
			for(let rewardItem of result){
				let rewardJson = {
                    "id": rewardItem['Id'],
                    "amount": rewardItem['Amount'],
					"description": rewardItem['Description']
				}
			rewards.push(rewardJson);
			}
		}

		return Project.getCreatorsByProjectId(projectId);
	}).
	then(function(result){
		if(result[0]==undefined){
			throw 'No Creator found';
		}
		else{
			for(let creatorItem of result){
				var creatorJson = {
                    "id": creatorItem.id,
                    "name": creatorItem.name
				};
			creators.push(creatorItem);
			}
		}
		return Project.getProjectById(projectId);
	}).
	then(function(result){
		if(result[0]==undefined){
			throw 'No project found';
		}
		else{
			project = {
				"id": result[0].Id,
				"creationDate": result[0].CreationDate,
				"data": {
					"title": result[0].Title,
					"subtitle": result[0].Subtitle,
					"description": result[0].Description,
					"imageUri": result[0].ImageUri
				},
				creators,
				rewards
            };
			target = result[0].Target;
		}
		//console.log(project);
		return Project.getBackersByProjectId(projectId);
	}).
	then(function(result){
		console.log(result);
		if(result[0]==undefined){
			throw 'No Backer found';
		}
		else{
			for(let backer of result){
				var backerJson = {
                    "name": backer.name,
					"amount": backer.Amount
				};
			backers.push(backerJson);
			}
		}
		
		console.log(backers);
		return Project.getCurrentPledgedByProjectId(projectId);
	}).
	then(function(result){
		
		if(result[0]==undefined){
			throw 'no Current Pledged';
		}
		else{
			currentPledged = result[0].currentPledged;
		}
		return Project.getnumberOfBackersByProjectId(projectId);
	}).
	then(function(result){
		
		if(result[0]==undefined){
			throw 'no number of backers';
		}else{
			numberOfBackers = result[0].numberOfBackers;	
		}
	}).
	finally(function(){
		let progress = {
		"target": target,
		"currentPledged": currentPledged,
		"numberOfBackers": numberOfBackers,
		}
		let dataJson = {	
			project,	
			progress,
			backers
		};
			
		return res.status(200).send(dataJson);
	}).
	catch(function(err) {
		console.log("catch error");
		console.log(err);
		res.status(400).send(err);
	});
};

exports.updateProject = function (req, res) {
	let isOpen = 0;
	
	
	if (req.body.open.toString().trim() == "true")
	{
		isOpen = 1;
	}

    let projectId = parseInt(req.params.id);
	let userId = parseInt(decodeToken(req.get('x-access-token')));
	Project.checkProjectCreator(userId, projectId).
	then(function(result){
		if(result[0]==undefined){
			throw 'unable to update a project you do not own';
		}else {
			return Project.updateProjectById(isOpen, projectId);
		}
	}).
	then(function(result){
		res.status(200).send('OK'); 
	}).
	catch(function(err) {
		if(err.message == 400){
			res.status(400).send('Malformed request');
		}else if (err.message == 401){
			res.status(401).send('Unauthorized - create account to update project');
		}else {
			res.status(400).send(err);
		}
	});
};

exports.viewProjectImage = function (req, res) {
    let projectId = req.params.id;
	
	Project.getImagePath(projectId).
	then(function(result){
		if(result[0]==undefined){
			throw '"Unknown Type: file"';
		}else {
			console.log(result);
			return readFile(result[0].imageUri);
		}
	}).
	then(function(imageData){
		res.writeHead(200, {"Content-Type": "image/jpeg"});
            res.write(imageData, 'binary');
            res.end();
	}).
	catch(function(err) {
		console.log("catch error");
		console.log(err);
		res.status(200).send(err);
	});
};

var readFile = function(uri){
	return new RSVP.Promise(function(resolve, reject){
		fs.readFile(uri, 'binary', function (err, result) {
			if(err){
				console.log(err);
				reject('CHECK YOUR UPLOADING PATH');
			}else{
				resolve(result);
			}
		});
	});
}


var uploadImage = function(newImageUri, imageData){
	return new RSVP.Promise(function(resolve, reject){	
        fs.writeFile(newImageUri, imageData, 'binary',function (err ,result) {
			if(err){
				console.log(err);
                return reject('can not upload image');
            }else{
				resolve('OK');
            }
		});
	});
};


exports.updateProjectImage = function (req, res) {
    let projectId = parseInt(req.params.id);
	let userId = parseInt(decodeToken(req.get('x-access-token')));

    let uploadingUri = './image/image.jpg';
	let imageName = 'newImage';
	let newImageUri = './image/'+imageName+'.jpg';
	
	
	Project.checkProjectCreator(userId, projectId).
	then(function(result){
		if(result[0]==undefined){
			throw 403;
		}else {
			return readFile(uploadingUri);
		}
	}).
	then(function(imageData){
		return uploadImage(newImageUri, imageData);
	}).
	then(function(result){
		return Project.updateImagePath(newImageUri, projectId);
	}).
	then(function(result){
		if(result.affectedRows == 1){
			res.status(200).send('OK');
		}
	}).
	catch(function(err) {
		console.log("catch error");
		console.log(err);
		if(err == 401 || err.message == 401){
			res.status(401).send('Unauthorized - create account to pledge to a project');
	}else if (err == 403 || err.message == 403){
			res.status(403).send('Forbidden - unable to update a project you do not own');
		}else {
			res.status(400).send(err);
		}
	});
};

 


exports.pledgeAmountToProject = function (req, res) {
	 let projectId = req.params.id;
    let amount = req.body.amount;
    let userId = parseInt(decodeToken(req.get('x-access-token')));
    if(req.body.card == undefined){
        res.status(400).send('unable to pledge');
    }
	let anonymous = 0;	
	if (req.body.anonymous.toString().trim() == "true")
	{
		anonymous = 1;
	}

    let authToken = req.body.card.authToken;
    let data = {
        "ProjectId": projectId,
        "Amount": amount,
        "isAnonymous": anonymous,
        "authToken": authToken,
        "UserId": userId
    }
	return Users.getUserByUserId(userId).
			then(function(result){
				if(result[0]==undefined || result[0].isDeleted == 1){
					throw 401;
				}else {
					return Project.IsProjectOpen(projectId);
				}
			}).
			then(function(result){
				console.log(result);
				if(result[0]==undefined){
					throw 'no project found';
				}else if (result[0].IsOpen == 0){
					throw 'The project is closed.';
				}else{
					return Project.InsertPledge(data);
				}
			}).
			then(function(result){
				res.status(200).json(result);}).
			catch(function(err) {
				console.log("catch error");
				console.log(err);
				if(err == 401 || err.message == 401){
					res.status(401).send('Unauthorized - create account to pledge to a project');
				}else if (err.message == 403){
					res.status(403).send('Forbidden - cannot pledge to own project - this is fraud!');
				}else {
					res.status(400).send(err);
				}
			});
};

exports.ViewProjectRewards = function (req, res) {
    let projectId = parseInt(req.params.id);
    Project.ViewProjectRewardsById(projectId).
	then(function(results){
		var rewards = [];
        for(let result of results){
			let reward = {
				"id": result.Id,
                "amount": result.Amount,
                "description": result.Description
                };
        rewards.push(reward);
        }
		res.status(200).send(rewards);
	}).
	catch(function(err) {
		console.log("catch error");
		console.log(err);
		if(err == 400){
			res.status(400).send('Malformed request');
		}else {
			res.status(400).send(err);
		}
	});	
};

exports.updateProjectRewards = function (req, res) {
    let projectId = parseInt(req.params.id);
	let userId = parseInt(decodeToken(req.get('x-access-token')));
	let bodies = req.body;
	let rewards = [];

    if(bodies[0] != undefined) {
        for (let body of bodies) {
            let rewardId = body.id;
            let amount = body.amount;
            let description = body.description.toString();
            let reward = [rewardId, amount, description, projectId];
            rewards.push(reward);
        }
    }else{
        res.status(400).send('Malformed request');
    }
	
	Project.checkProjectCreator(userId, projectId).
	then(function(result){
		if(result[0]==undefined){
			throw 'unable to update a project you do not own';
		}else {
			return Project.updateProjectRewardsById(rewards);
		}
	}).
	then(function(result){
		console.log(result);
		res.status(200).send('OK'); 
	}).
	catch(function(err) {
		console.log("catch error");
		console.log(err);
		if(err == 400){
			res.status(400).send('Malformed request');
		}else if (err.message == 401){
			res.status(401).send('Unauthorized - create account to update project');
		}else {
			res.status(400).send(err);
		}
	});
};
