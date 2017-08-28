/**
 * Created by hli60 on 13/08/17.
 */

const express = require('express');
const bodyParser = require('body-parser');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

module.exports = function () {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.route('/test').get(function (req, res) {
        res.send("test");
    })
    const Routes = require('../app/routes/user.server.routes.js');
    Routes(app);
	
    return app;
};