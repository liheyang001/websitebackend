/**
 * Created by hli60 on 13/08/17.
 */

const db = require('../../config/db.js');

exports.getAll = function (startIndex, count, done) {
    let endIndex = startIndex + count;
    db.get().query('SELECT id, title, subtitle, imageUri FROM projects;', function (err, rows) {
        if (!err){
            let info = [];
            for (let i = startIndex; i < endIndex; i++){
                info = {
                    "id" : rows[i].id,
                    "title": rows[i].title,
                    "subtitle" : rows[i].subtitle,
                    "imageUri": rows[i].imageUri
                };
            }
            return done (null, info);
        } else {
            return done (err);
        }
    });
};

exports.insert = function (info, done) {
    let title = info['title'];
    let subtitle = info['subtitle'];
    let description = info['description'];
    let imageUri = info['imageUri'];
    let target= info['target'];
    let creator = info[''];
    let rewards = info[''];

    let values = [title, subtitle, description, imageUri, target, [creator],[rewards]];
    let sql = 'INSERT INTO projects (title, subtitle, description, imageUri, target, creator, rewards) ' +
        'VALUES (?,?,?,?,?,?,?);';
    db.post().query(sql, [values], function (err, result) {
        if (!err){
            return done ({"SUCCESS" : "success insert a project"});
        } else {
            return done (err);
        }
    });
};

exports.getOne = function (info, done) {
    db.get().query('SELECT * FROM project WHERE projectId = ?', info, function (err, rows) {
        if(!err){
            let creationDate = rows[0].creationDate;
            let title = rows[0].title;
            let subtitle = rows[0].subtitle;
            let description = rows[0].description;
            let imageUri = rows[0].imageUri;
            let target = rows[0].target;
            let progress = rows[0].progress;



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

exports.listReward = function (rewardId, done) {
    db.get().query('SELECT id, amount, description FROM reward where rewardId = ?', [rewardId], function (err, rows) {
        let res = [];
        if(!err){
            return done(rows);
        }else {
            for (data in rows){
                let id = data.id;
                let amount = data.amount;
                let description = data.description;
                let info = {
                    "id" : id,
                    "amount": amount,
                    "description": description
                };
                res.push(info);
            }

            return done(err, res);
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