var app = require('express')();
var path = require("path");
var bodyParser = require('body-parser');

function routing(app, connection, sessionInfo) {


    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    app.get('/', function (req, res) {
        var uid = "";

        sessionInfo = req.session;

        if (sessionInfo.uid) {
            res.redirect('/home#?id=' + sessionInfo.uid);
        }
        else {
            res.render("login");
        }

    });

    app.get('/login', function (req, res) {
        res.sendFile(path.join(__dirname + '/../auth-login.html'));
    });

    app.get('/login', function (req, res) {

        sessionInfo = req.session;
        username = req.body.username;
        password = req.body.password;
        console.log('jjj')

        var data = {
            query: "select * from user where password = '" + password + "' and name = '" + username + "' ",
            connection: connection
        };

        query_runner(data, function (result) {
            console.log('aaa')
            var uid = "";
            result.forEach(function (element, index, array) {
                uid = element.id;
            });

            if (result.length > 0) {
                sessionInfo.uid = uid;
                console.log('bbb')
                var set_online = {
                    query: "update user set online = 'Y' where where id='" + uid + "'",
                    connection: connection
                }
                console.log('fff')

                query_runner(set_online, function (result_online) { });
                result_send = {
                    is_logged: true,
                    id: uid,
                    msg: "OK"
                };
                console.log('ccc')
            }
            else {
                result_send = {
                    is_logged: false,
                    id: null,
                    msg: "NOT OK"
                };
                console.log('eee')
            }

            res.write(JSON.stringify(result_send));
            res.end();
            console.log('ddd')

        });
    });

    app.post('/check_name', function (req, res) {

        username = req.body.username;

        var data = {
            query: "select * from user where name='" + username + "'",
            connection: connection
        };

        query_runner(data, function (result) {

            if (result.length > 0) {
                result_send = {
                    msg: true
                };
            }
            else {
                result_send = {
                    msg: false
                };
            }

            res.write(JSON.stringify(result_send));
            res.end();

        });

    });

    app.get('/register', function (req, res) {
        res.sendFile(path.join(__dirname + '/../auth-register.html'));
    })

    app.post('/register', function (req, res) {
        sessionInfo = req.session;
        sessionInfo.uid = '';

        var insert_data = {
            id: '',
            name: req.body.username,
            password: req.body.password,
            timestamp: Math.floor(new Date() / 1000),
            online: 'Y'
        };

        var data = {
            query: "INSERT INTO user SET ?",
            connection: connection,
            insert_data
        };

        query_runner(data, function (result) {

            sessionInfo.uid = result.insertID;

            if (result) {
                result_send = {
                    is_logged: true,
                    id: result.insertId,
                    msg: "OK"
                };
            }

            else {
                result_send = {
                    is_logged: false,
                    id: null,
                    msg: "NOT OK"
                };
            }
            console.log(result_send.is_logged)
            console.log(result_send.id)

            res.write(JSON.stringify(result_send));
            res.end();

        });

    });

    var query_runner = function (data, callback) {
        var db_connection = data.connection;
        var query = data.query;
        var insert_data = data.insert_data;
        db_connection.getConnection(function (err, con) {
            if (err) {
                console.log(err)
                // con.release();
            } else {
                db_connection.query(String(query), insert_data, function (err, rows) {
                    con.release();
                    if (!err) {
                        callback(rows);
                    } else {
                        console.log(err);
                        console.log("Query failed");
                    }
                });
            }
        });
    }

}

module.exports = routing;