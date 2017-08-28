/**
 * Created by hli60 on 13/08/17.
 */

const db = require('./config/db'),
    express = require('./config/express');

const app = express();

db.connect(function (err) {
    if(err){
        console.log('Unable to connect to MySQL.');
    } else {
        /*app.listen(3000, function () {
            console.log('Listening on port: ' + 3000);*/
        app.listen(4941, function () {
            console.log('Listening on port ' + 4941);

        });
    }
});
