/**
 * Created by hli60 on 13/08/17.
 */

const db = require('../../config/db.js');

var err400 = new Error('400');
var err401 = new Error('401');
var err403 = new Error('403');
var err404 = new Error('404');

exports.getAll = function (done) {
    db.get().query('SELECT id FROM projects', function (err, rows) {
        if (!err){
            return done (rows);
        } else {
            return done (err);
        }
    });
};

exports.insert = function (userInput, done) { //logInId
    let projectTitle = userInput['title'];
    let projectSubtitle = userInput['subtitle'];
    let projectDesc = userInput['description'];
    let projectImageUri = userInput['imageUri'];
    let projectTarget = userInput['target'];
    let info = [projectTitle, projectSubtitle, projectDesc, projectImageUri, projectTarget];
    db.post().query('INSERT INTO projects (projectTitle, projectSubtitle, ' +
        'projectDesc, projectImageUri, projectTarget) VALUES (?)', [info], function (err, rows) {
        if (!err){
            db.get().query('SELECT projectId FROM projects ORDER BY projectId DESC LIMIT 1', function (rows, err) {
                if (!err){
                    return done(rows);
                } else {
                    return done(err);
                }
            });
        } else {
            return done(err);
        }
    });
};

exports.getOne = function (projectId, done) {
    db.get().query('SELECT * FROM project WHERE projectId = ?', [projectId], function (err, rows) {
        if(!err){
            return done(rows);
        } else {
            return done(err);
        }
    });
};

exports.alter = function (projectName, projectId, done) {
    db.put().query('UPDATE project SET projectName = ? WHERE projectId = ?', [projectName, projectId], function (err, result) {
        if(!err){
            return done({"SUCCESS":"success update project detail!"});
        }else{
            return done(err);
        }
    });
};

exports.getOneImage = function (imageId, done) {
    db.get().query('SELECT * FROM project where imageId = ?', [imageId], function (err, rows) {
        if(!err){
            return done(rows);
        } else {
            return done (err);
        }
    });
};

exports.alterOneImage = function (imageFile, imageId, done) {
    db.put().query('UPDATE image SET imageFile = ? WHERE imageId = ?', [imageFile, imageId], function (err, result) {
        if(!err){
            return done({"SUCCESS":"success update image file!"});
        } else {
            return done (err);
        }
    });
};

exports.pledgeAmount = function (amount) {
    db.post().query('INSERT INTO pledge (amount) VALUES ?', [amount], function (err, result) {
        if(!err){
            return done({"SUCCESS": "success insert amount to pledge!"});
        } else {
            return done(err);
        }
    });
};

exports.getOneReward = function (rewardId, done) {
    db.get().query('SELECT * FROM reward where rewardId = ?', [rewardId], function (err, rows) {
        if(!err){
            return done(rows);
        }else {
            return done(err);
        }
    });
};

exports.alterReward = function () {
    db.put().query('UPDATE reward set amount = ?  WHERE rewardId = ?', [amount, rewardId], function (err, result) {
        if(!err){
            return done({"SUCCESS" : "success update amount for reward!"});
        } else {
            return done(err);
        }
    });
};