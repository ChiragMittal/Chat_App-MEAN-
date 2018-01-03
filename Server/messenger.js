var messenger = {

    query_runner : function (data, callback) {
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

        query_runner(insert_conservation, function (result) {
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
                msg: data.reply
            }
        }

        query_runner(insert_message, function (result) {
            callback(result);
        })

    },


    call_message_conversation : function (data,connection,callback){

        var conversation_data = {
            from_id : data.from_id,
            to_id : data.to_id,
            con_id : data.con_id
        }

        insertConversation(conversation_data,connection,function(is_conversation_present){

            var insert_msg = {
                id: "",
                from_id: data.from_id,
                to_id: data.to_id,
                con_id: data.con_id,
                timestamp: Math.floor(new Date() / 1000),
                msg: data.reply
            }

            insertMessage(insert_msg,connection,function(is_msg_present){
                callback({ is_msg_present });
            });

        });

    },

        getUserInfo : function(user_id,connection,callback){

        var data = {
            query : "select id,name from user = '"+user_id+"'",
            connection : connection
        }

        query_runner(data,function(result){

            if(result.length > 0){
                var Info = "";
                result.forEach(function(element, index, array){
                     Info = {
                        id : element.id,
                        name : element.name
                    }
                })

                result_send={
                    data : Info,
                    msg : "OK"
                };
            }
            else{
                result_send={
                    data : null,
                    msg : "BAD"
                };
            }

            callback(result_send);

        })

    },


    save_msg : function (data,connection,callback){

        var check_data = {
            from_id : data.from_id , 
            to_id : data.to_id
        }

        isConversationPresent(check_data,connection,function(present){

            if(present.is_present){

                var msg_after_conversation = {
                        msg: data.reply ,
                        from_id : data.from_id , 
                         to_id : data.to_id,
                         con_id: data.con_id
                }

                call_message_conversation(msg_after_conversation,connection,function(insert_message){

                    getUserInfo(data.from_id,connection,function(get_info){

                        insert_message.name = get_info.name ;
                        callback(insert_message);

                    });

                });

            }

            else {

                getLastconversationId(connection,function(con_id){


                    var msg_after_conversation = {
                            msg: data.reply ,
                            from_id : data.from_id , 
                             to_id : data.to_id,
                             con_id: data.con_id
                    }

                    call_message_conversation(msg_after_conversation,connection,function(insert_message){

                        getUserInfo(data.from_id,connection,function(get_info){

                            insert_message.name = get_info.name ;
                            callback(insert_message);

                        });

                    });


                });

            }

        });

    },

    getMsg : function(data,connection,callback){

        var get_msg = {
            query : "select reply as msg,from_id,to_id,timestamp from conversation_reply where from_id='"+data.from_id+"' and to_id='"+data.uid+"' or  from_id='"+data.uid+"' and to_id='"+data.from_id+"' order by timestamp asc",
            connection : connection
        }

        query_runner(get_msg,function(result){

            if(result.length > 0){
                callback(result);
        }
        else{
            callback(null);
        }

    });
  },

    

    getUser_Chat_List : function (user_id,connection,callback){

    },

    getUser_to_Chat : function(user_id,connection,callback){

        var data = {
            query:"SELECT  to_id, from_id FROM conversation WHERE to_id='"+uid+"' OR from_id='"+uid+"' GROUP BY con_id DESC  ",
            connection : connection
        }

        query_runner(data , function(result){

            var Users=[];

            if(result.length > 0){

                var filter_user=[];

                result.forEach(element, index, array){

                    filter_user.push[element.to_id];
                    filter_user.push[element.from_id];

                }

                filter = filter.join();
                data.query="SELECT * FROM user WHERE id NOT IN ("+filter+")";
            }else{
                data.query="SELECT * FROM user WHERE id NOT IN ("+uid+")";
            }

            callback(result);

            }

        });

    },

}