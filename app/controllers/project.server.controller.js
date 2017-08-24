/**
 * Created by hli60 on 13/08/17.
 */


const Project = require('../models/project.server.model.js');

exports.viewAllProjects = function(req, res){
    Project.getAll(function (result) {
        res.json(result);
    });
};

exports.createProject = function (req, res) {
    let projectTitle = req.body.title.toString();
    let projectSubtitle = req.body.subtitle.toString();
    let projectImageUri = req.body.imageUri.toString();
    let projectDesc = req.body.description.toString();
    let projectTarget = req.body.target;
   // let creatorId = req.body.creatorId;
   // let rewardsId = req.body.rewardsId;
    let info = {
        "title" : projectTitle,
        "subtitle": projectSubtitle,
        "description": projectDesc,
        "imageUri": projectImageUri,
        "target": projectTarget,
    //    "creators": [],
    //    "rewards":[]
    }
    Project.insert(info, function (result, err) { //logInId
        if (err) {
            if (err.message == 400) {
                res.status(400).send('Malformed project data');
            } else if (err.message == 401) {
                res.status(401).send('Unauthorized - create account to create project');
            }
        }else{
            res.status(200).json(result);
            }
    });
};

exports.viewProjectDetails = function (req, res) {
    let projectId = req.params.projectId;
    Project.getOne(projectId, function (result) {
        res.json(result);
    });
};

exports.updateProject = function (req, res) {
    let projectName = req.body.projectname.toString();
    let values = [[projectname]];
    let projectId = req.params.projectId;
    Project.alter(projectId, projectName, function (result) {
        res.json(result);
    });
};

exports.viewProjectImage = function (req, res) {

};

exports.updateProjectImage = function (req, res) {

};

exports.pledgeAmount = function (req, res) {

};

exports.viewProjectRewards = function (req, res) {

};

exports.updateProjectRewards = function (req, res) {

};