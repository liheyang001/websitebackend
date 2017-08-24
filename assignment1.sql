CREATE TABLE project (
projectId  int unsigned not null auto_increment,
projectTitle   varchar(150)    not null,
projectSubtitle    varchar(150) not null,
projectImageUri   varchar(150)    not null,
projectDesc    varchar(150),
projectTarget  int(10) not null default 0,
creatorId  int(10),
creationDate   timestamp,
currentPledge  int(10) default 0,
numberOfBackers  int(10) default 0,
rewardsId   int unsigned not null,
primary key (projectId),
foreign key (creatorId) references userCreator (creatorId),
foreign key (rewardsId) references reward (rewardsId)   
);

Create table reward (
rewardsId  int unsigned not null auto_increment,
rewardAmount   int(10) not null,
rewardDesc varchar(150),
projectId  int unsigned not null,
primary key (rewardsId),
foreign key (projectId) references project (projectId)
);

create table pledge (
pledgeId   int unsigned not null auto_increment,
backerId   int(10) not null,
projectId  int unsigned not null,
amount  int(15) not null,
anonymous   bool not null default 0,
authToken   varchar(150)    not null,
primary key (pledgeId),
foreign key (backerId) references userBacker (backerId),
foreign key (projectId) references project (projectId)
);

create table userBacker (
backerId int(10) not null  auto_increment,
backerName varchar(150) not null,
backerPassword varchar(150) not null,
backerLocation    varchar(150) not null,
backerEmail    varchar(150) not null,
primary key (backerId)   
);

create table userCreator (
creatorId int(10) not null  auto_increment,
creatorName varchar(150) not null,
creatorPassword varchar(150) not null,
creatorLocation    varchar(150) not null,
creatorEmail    varchar(150) not null,
primary key (creatorId)      
);

create table logInResponse (
logInId int(10) not null,
logInToken  varchar(150)    not null,
primary key (logInId)
);

