/**
 * Created by hli60 on 13/08/17.
 */

const users = require('../controllers/users.server.controller.js');
const projects = require('../controllers/project.server.controller');

module.exports = function (app) {
    app.route('/projects').get(projects.viewAllProjects).post(projects.createProject);
    app.route('/projects/:userId').get(projects.viewProjectDetails).put(projects.updateProject);
    app.route('/projects/:userId/image').get(projects.viewProjectImage).put(projects.updateProjectImage);
    app.route('/projects/:userId/pledge').post(projects.pledgeAmount);
    app.route('/projects/:userId/rewards').get(projects.viewProjectRewards).put(projects.updateProjectRewards);
    app.route('/users').post(users.createUser);
    app.route('/users/login').post(users.userLogIn);
    app.route('/users/logout').post(users.userLogOut);
    app.route('/users/:userId').get(users.getUserDetails).put(users.updateUser).delete(users.deleteUser);
};

