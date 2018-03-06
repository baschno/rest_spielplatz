var express = require("express");
var router = express.Router();
var cassandra = require("cassandra-driver");
var config = require("../config");

var client = new cassandra.Client({
  contactPoints: [config.cassandra_seednodes]
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
