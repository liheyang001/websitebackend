/**
 * Created by hli60 on 13/08/17.
 */

const users = require('../controllers/user.server.controller.js');
const projects = require('../controllers/project.server.controller.js');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens



// route middleware to verify a token
var middleWare = function(req, res, done) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, 'secret', function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        done();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
};


module.exports = function (app) {

    // projects
    app.route('/projects').get(projects.viewAllProjects);
    app.route('/projects/:id').get(projects.viewProjectDetails);
    app.route('/projects/:id/image').get(projects.viewProjectImage);

    app.put('/projects/:id', middleWare, projects.updateProject);
    app.post('/projects', middleWare, projects.createProject);
    app.put('/projects/:id/image', middleWare, projects.updateProjectImage);
    app.post('/projects/:id/pledge', middleWare, projects.pledgeAmountToProject);


    // Rewards
    app.route('/projects/:id/rewards').get(projects.ViewProjectRewards);

    app.put('/projects/:id/rewards', middleWare, projects.updateProjectRewards);

    // Users
    app.post('/users/logout', middleWare, users.logOut);
    app.put('/users/:id', middleWare, users.updateUser);
    app.delete('/users/:id', middleWare, users.deleteUser);

    app.get('/users/:id', users.getUserByUserId);
    app.route('/users').post(users.createUser);
    app.route('/users/login').post(users.login);


};