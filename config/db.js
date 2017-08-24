/**
 * Created by hli60 on 13/08/17.
 */

const mysql = require('mysql');

const state = {
    pool: null
};

exports.connect = function (done) {
    state.pool = mysql.createPool({
        connectionLimit : 500,
        host: process.env.SENG365_MYSQL_HOST || 'localhost',
        user: 'root',
        password: "secret",
        port: process.env.SENG365_MYSQL_HOST || '6033',
        database: "mysql",
        multipleStatements: true
    });

    //
    // /* create table */
    // let createTable = 'create database mysql;' +
    //     'use mysql;'+
    //     'create table if not exists logInResponse ('+
    //     'logInId int(10) not null,'+
    //     'logInToken  varchar(150)    not null,'+
    //     'primary key (logInId));'+
    //
    //
    //
    //     'create table if not exists users (userId int(10) not null  auto_increment,'+
    //     'userName varchar(150) not null,'+
    //     'userPassword varchar(150) not null,'+
    //     'userLocation    varchar(150) not null,'+
    //     'userEmail    varchar(150) not null,'+
    //     'primary key (userId));'+
    //
    //     'CREATE TABLE if not exists projects ('+
    //     'projectId  int unsigned not null auto_increment,'+
    //     'projectTitle   varchar(150)    not null,'+
    //     'projectSubtitle    varchar(150) not null,'+
    //     'projectDesc    varchar(150),'+
    //     'projectImageUri   varchar(150)    not null,'+
    //     'projectTarget  int(10) not null default 0,'+
    //     'creatorId  int(10),'+
    //     'creationDate   timestamp,'+
    //     'currentPledge  int(10) default 0,'+
    //     'numberOfBackers  int(10) default 0,'+
    //     'rewardsId   int unsigned not null,'+
    //     'primary key (projectId));'+
    //
    //     'create table if not exists creates ('+
    //     'userId int(10) not null,'+
    //     'projectId int unsigned not null,'+
    //     'foreign key (projectId) references projects(projectId),'+
    //     'foreign key (userId) references users(userId));'+
    //
    //     'Create table if not exists rewards ('+
    //     'rewardId  int unsigned not null auto_increment,'+
    //     'rewardAmount   int(10) not null,'+
    //     'rewardDesc varchar(150),'+
    //     'projectId  int unsigned not null,'+
    //     'primary key (rewardId),'+
    //     'foreign key (projectId) references projects (projectId));'+
    //
    //
    //     'create table if not exists pledges ('+
    //     'pledgeId   int unsigned not null auto_increment,'+
    //     'backerId   int(10) not null,'+
    //     'rewardId	int unsigned not null,'+
    //     'projectId  int unsigned not null,'+
    //     'amount  int(15) not null,'+
    //     'anonymous   bool not null default 0,'+
    //     'authToken   varchar(150)    not null,'+
    //     'pledgeTime timestamp,'+
    //     'primary key (pledgeId),'+
    //     'foreign key (rewardId) references rewards (rewardId),'+
    //     'foreign key (backerId) references users (userId),'+
    //     'foreign key (projectId) references projects (projectId));';
    //
    //
    // console.log(createTable);
    // state.pool.query(createTable,function (err,rows) {
    //     if (err)
    //     {
    //         state.pool.query('drop database mysql;');
    //         console.log(err);
    //     }
    // });


    done();

};



exports.post = function () {
    return state.pool;
};

exports.put = function () {
    return state.pool;
};

exports.delete = function () {
    return state.pool;
};

exports.get = function () {
    return state.pool;
};

