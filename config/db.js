/**
 * Created by hli60 on 13/08/17.
 */

const mysql = require('mysql');

const state = {
    pool: null
};

/*
exports.connect = function (done) {
    state.pool = mysql.createPool({
        host: '127.0.0.1',
        user: 'root',
        password: "jie821129",
        port: '3306',
        database: 'crowdfunding'
    });
    done();
};
*/

exports.connect = function(done){
    state.pool = mysql.createPool({
        connectionLimit: 500,
        host: process.env.SENG365_MYSQL_HOST || 'localhost',
        port: process.env.SENG365_MYSQL_PORT || 6033,
        user: 'root',
        password: 'secret',
        database: 'mysql',
        multipleStatements: true
    });

    let createTable =
        'drop table ProjectCreators;'+
        'drop table Reward;'+
        'drop table Pledge;'+
        'drop table Project;'+
        'drop table Users;'+


        'CREATE TABLE IF NOT EXISTS Users ('+
        'id int(10) not null  auto_increment,'+
        'name varchar(150) not null,'+
        'password varchar(150) not null,'+
        'location varchar(150) not null,'+
        'email varchar(150) not null,'+
        'token varchar(150),'+
        'isBacker tinyint(1) DEFAULT 0,'+
        'isDeleted tinyint(1) DEFAULT 0,'+
        'PRIMARY KEY (id));'+

        'CREATE TABLE IF NOT EXISTS Project ('+
        'Id int not null auto_increment,'+
        'Title varchar(150) not null,'+
        'Subtitle varchar(150) not null,'+
        'ImageUri varchar(150) not null,'+
        'Description varchar(150),'+
        'Target int(10) not null default 0,'+
        'CreatorId int(10),'+
        'CreationDate timestamp,'+
        'IsOpen tinyint(1) default 0,'+
        'PRIMARY KEY (Id),'+
        'FOREIGN KEY(CreatorId) REFERENCES Users(id));'+

        'CREATE TABLE IF NOT EXISTS ProjectCreators('+
        'Id int not null auto_increment,'+
        'ProjectId int not null,'+
        'UserId int not null,'+
        'PRIMARY KEY (Id),'+
        'FOREIGN KEY(UserId) REFERENCES Users(id),'+
        'FOREIGN KEY(ProjectId) REFERENCES Project(id));'+

        'CREATE TABLE IF NOT EXISTS Reward ('+
        'Id int not null auto_increment,'+
        'Amount int(10) not null,'+
        'Description varchar(150),'+
        'ProjectId  int (10),'+
        'PRIMARY KEY (Id),'+
        'FOREIGN KEY (ProjectId) REFERENCES Project (Id),'+
        'FOREIGN KEY(Id) REFERENCES Users (id));'+

        'CREATE TABLE Pledge ('+
        'Id int not null auto_increment,'+
        'AuthToken varchar(150) not null,'+
        'BackerId int(10) not null,'+
        'ProjectId  int(10) not null,'+
        'Amount int(15) not null,'+
        'IsAnonymous bool default 0,'+
        'PRIMARY KEY (Id),'+
        'FOREIGN KEY (BackerId) references Users (id),'+
        'FOREIGN KEY (ProjectId) references Project (Id));';

    state.pool.query(createTable, function (err, rows) {
                    if(err){
                        console.log(err);

                    }else{
                        console.log('success to create tables');
                    }
                });
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
