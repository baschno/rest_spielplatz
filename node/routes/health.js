var express = require("express");
var router = express.Router();
var cassandra = require("cassandra-driver");
var config = require("../config");

var node_list = ["0.0.0.0", "172.18.0.2", "172.18.0.3", "172.18.0.4"];
var succ_list = [];
var err_list = [];

node_list.forEach(element => {
    console.log("Working on " + element);
    var client = new cassandra.Client({
      contactPoints: [element]
    });
    client.connect().then(function(x) {
        console.log("connected to " + element);
        return element;
    })
    .then(function (data){
        client.shutdown();
    })
    .catch(function(err) {
        console.log("Not connected. " + err)
    })
});

function checkHost(url, method) {
    var promise = new Promise(function(resolve, reject) {
        setTimeout(function() {
            var data;
            if (data) {
                resolve(data);
            } else {
                reject('No data');
            }
        }, 1000);
    });

    return promise;
}

checkHost('http://www.google.de', 'GET')
    .then(function(data) {
        console.log(data);
    })
    .catch(function(err) {
        console.log(err);
    });

const query = "SELECT * from system.hints";

/* GET home page. */
router.get("/", function(req, res, next) {
    client
    .execute(query)
    .then(result => console.log("Result %s", result.rows[0]));

    var casinfo = {};
    client.hosts.forEach(element => {
        let casinfo_item = {
            version: element.cassandraVersion,
            rack: element.rack,
            datacenter: element.datacenter
        }
        casinfo[element.address] = casinfo_item;
    });

    console.log(casinfo);
    
    res.setHeader('Content-Type', 'application/json');
    res.json({Result: 'OK', content: casinfo});
});

module.exports = router;
