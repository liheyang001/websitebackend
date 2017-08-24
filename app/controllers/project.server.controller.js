/**
 * Created by hli60 on 13/08/17.
 */


const Project = require('../models/project.server.model.js');

exports.viewAllProjects = function(req, res){
    let startIndex = req.query.startIndex;
    let count = req.query.count;
    Project.getAll(startIndex, count, function (result) {
        res.json(result);
    });
};

exports.createProject = function (req, res) {

    let project = req.body.project;
    if (project == undefined) {
        res.status(400).send('Malformed request');
    }


    let data = {
        "title": project.title,
        "subtitle": project.subtitle,
        "description": project.description,
        "imageUri": project.imageUri,
        "target": project.target,
        "creators": [req.body.creatorId, req.body.creatorName],
        "rewards": [req.body.rewardsId, req.body.amount, req.body.description]
    };

    Project.insert(data, function (err, rows) {
        if (err) {
            if (err.message == 401) {
                res.status(401).send('Unauthorized - create account to create project');
            } else {
                res.status(400).send('Malformed request');
            }
        } else {
            res.status(200).json(rows);
        }
    });
};


exports.read = function (req, res) {
    let projectId = req.params.projectId;
    Project.getOne(projectId, function (result) {
        res.json(result);
    });
};

exports.update = function (req, res) {
    let projectName = req.body.projectname.toString();
    let values = [[projectname]];
    let projectId = req.params.projectId;
    Project.alter(projectId, projectName, function (result) {
        res.json(result);
    });
};

exports.readImage = function (req, res) {
    let imageId = req.params.imageId;
    Project.getOneImage(imageId, function (err, rows) {
        if(err){
            res.status.send("Unknown Type: file");
        }
        else{
            res.writeHead(400, {"Content-Type": "image/jpeg"});
            res.write(result, 'binary');
            res.end();
        }
    });
};

exports.updateImage = function (req, res) {
    let id = req.params.id;
    let token = req.get('X-Authorization');
    let decoded = jwt.decode(token, '123456789');
    let login_id = decoded.iss;
    Project.updateProjectImage(id, login_id, function (err, rows) {
        if (err) {
            if(err.message == 400){
                res.status(400).send("Malformed request");
            } else if (err.message == 401){
                res.status(401).send("Unauthorized - create account to update project");
            } else{
                res.status(403).send("Forbidden - unable to update a project you do not own");
            }
        }else{
            res.status(201).json(rows);
        }
    });
};

exports.createPledge = function (req, res) {
    let id = req.params.id;
    let amount = req.body.amount;
    let anonymous = req.body.anonymous;
    let token = req.get('X-Authorization');
    let decoded = jwt.decode(token, '123456789');
    let login_id = decoded.iss;
    if(card == undefined){
        res.status(400).send('bad user, project, or pledge details');
    }
    let authToken = req.body.card.authToken;
    let data = {
        "id": id,
        "amount": amount,
        "anonymous": anonymous,
        "authToken": authToken,
        "logInId": login_id
    }
    Project.pledgeAmountToProject(data, function (err, rows) {
        if (err){
            if(err.message == 401){
                res.status(401).send('Unauthorized - create account to pledge to a project');
            }else{
                res.status(403).send('Forbidden - cannot pledge to own project - this is fraud!');
            }
        }else{
            res.status(201).json(rows);
        }
    });
};

exports.viewRewards = function (req, res) {
    let projectId = req.params.projectId;
    project.listReward(projectId, function (err, rows) {
        if(err){
            res.status.send("Please re-enter a Id");
        }
        else{
            res.status(200).json(rows);
        }
    });
};

exports.updateRewards = function (req, res) {
    let projectId = req.params.projectId;
    let token = req.get('X-Authorization');
    let decoded = jwt.decode(token, '123456789');
    let login_id = decoded.iss;
    Project.updateProjectRewards(projectId, login_id, function (err, rows) {
        if (err){
            if(err.message == 400){
                res.status(400).send('Malformed request');
            }else if(err.message == 401){
                res.status(401).send('Unauthorized - create account to update project');
            }else{
                res.status(403).send('Forbidden - unable to update a project you do not own');
            }
        }else{
            res.status(201).json(rows);
        }
    })
};