drop table ProjectCreators; 
drop table Reward; 
drop table Pledge;
drop table Project;
drop table Users;



CREATE TABLE Users (
id int(10) not null  auto_increment,
name varchar(150) not null,
password varchar(150) not null,
location    varchar(150) not null,
email    varchar(150) not null,
token varchar(150) not null,
isBacker tinyint(1) DEFAULT 0,
isDeleted tinyint(1) DEFAULT 0,
PRIMARY KEY (id)   
);

CREATE TABLE Project (
Id  int not null auto_increment,
Title   varchar(150)    not null,
Subtitle    varchar(150) not null,
ImageUri varchar(150) not null,
Description    varchar(150),
Target  int(10) not null default 0,
CreatorId  int(10),
CreationDate   timestamp,
IsOpen tinyint(1) default 0,
PRIMARY KEY (Id),
FOREIGN KEY(CreatorId) REFERENCES Users(id)
);


CREATE TABLE ProjectCreators(
Id  int not null auto_increment,
ProjectId int not null,
UserId int not null,
PRIMARY KEY (Id),
FOREIGN KEY(UserId) REFERENCES Users(id),
FOREIGN KEY(ProjectId) REFERENCES Project(id)
);


CREATE TABLE Reward (
Id  int not null auto_increment,
Amount   int(10) not null,
Description varchar(150),
ProjectId  int (10),
PRIMARY KEY (Id),
FOREIGN KEY (ProjectId) REFERENCES Project (Id),
FOREIGN KEY(Id) REFERENCES Users (id)
);

CREATE TABLE Pledge (
Id int not null auto_increment,
AuthToken varchar(150) not null,
BackerId   int(10) not null,
ProjectId  int(10) not null,
Amount  int(15) not null,
IsAnonymous   bool default 0,
PRIMARY KEY (Id),
FOREIGN KEY (BackerId) references Users (id),
FOREIGN KEY (ProjectId) references Project (Id)
);



