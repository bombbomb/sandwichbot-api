'use strict';
var jj = require('Jimmy-Johns'),
    AWS = require('aws-sdk'),
    dynamodb = new AWS.DynamoDB(),
    docClient = new AWS.DynamoDB.DocumentClient();

const tableName = 'sandwich';

module.exports.order = function(event, context, cb){

    var menu = jj.get_menu();
    var order_items = [(menu[0]).data];

    var user_data = {
        email:"pmcdavid@gmail.com", //your Jimmy John's account email
        password:"xxx",    //your Jimmy John's account password
        first_name:"NAME",
        last_name:"NAME",
        phone:"444-444-4444",
        tip_amount:"2",         //Tip amount (in dollars)
        location_id:1106,       //More on this below
        is_test:true,
        verbose:true,
        address: {
            line1: "123 W Apple Street",
            line2: "",
            city: "Little Rock",
            state: "NY",
            zipcode:"90501",
            longitude:-100.1692740, //These should be YOUR lat/long
            latitude:60.0719220
        },
        payment_info: {
            exp_month:"07",
            exp_year:2019,
            cvv:333
        }
    };

    jj.order(user_data, order_items, function(success, error) {
        if (!error) {
            cb(null, { message: 'sandwich is in the mail', event });
        } else {
            console.log("ERROR: ", error);

            cb(null, { message: 'something broke', event });
        }

    });


};

module.exports.menu = function(event, context, cb){
    cb(null, jj.get_menu());
};

module.exports.create_account = function(event, context, cb){


    console.log("create_account event: ", event);
    docClient.get({TableName: tableName, Key:{"email": event.payload.email}}, function(err, data){
        if (err) {

            docClient.put({
                TableName: tableName,
                Item: {
                    email: 'dolphin'
                }
            }, function(err, data){

            });

            cb(null, '');
        } else {
            cb("Account already exists.");
        }
    });


};


//create account