var messenger = {

    query_runner = function (data, callback) {
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
    },

    getLastconversationId: function (connection, callback) {
        var data = {
            query: "SELECT MAX(con_id) as ID from conversation",
            connection: connection
        }

        query_runner(data, function (result) {
            if (result[0].ID != null) {
                var conversation_id = parseInt(result[0].Id);
                conversation_id++;
                callback({
                    Id: conversation_id
                });
            }
            else {
                Id: 0
            }
        });
    },

    isConversationPresent: function (data, connection, callback) {
        var is_present = false;
        var con_id = "";

        var present_data = {
            query: "select * from conversation where to_id='" + data.to_id + "' and from_id='" + data.from_id + "' or to_id='" + data.from_id + "' and from_id='" + data.to_id + "' limit 1",
            connection: connection
        }

        query_runner(present_data, function (result) {
            if (result.length > 0) {
                is_present = true;
                con_id: result[0].con_id;
            }
            else {
                is_present = false;
                con_id: 0;
            }

            callback({
                is_present = is_present,
                con_id: con_id
            })
        });

    },

    insertConversation: function (data, connection, callback) {

        var insert_conservation = {
            query: "SELECT * from conversation SET ?",
            connection: connection,
            insert_data: {
                id: "",
                from_id: data.from_id,
                to_id: data.to_id,
                con_id: data.con_id,
                timestamp: Math.floor(new Date() / 1000),
            }
        }

        query_runner: (insert_conservation, function (result) {
            callback(result);
        })

    },

    insertMessage: function (data, connection, callback) {

        var insert_message = {
            query: "SELECT * from messages SET ?",
            connection: connection,
            insert_data_msg: {
                id: "",
                from_id: data.from_id,
                to_id: data.to_id,
                con_id: data.con_id,
                timestamp: Math.floor(new Date() / 1000),
                reply: data.reply
            }
        }

        query_runner: (insert_message, function (result) {
            callback(result);
        })

    },

}