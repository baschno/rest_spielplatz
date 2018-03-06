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
    .then(result => console.log("Result %s", result.rows[0].name));

    console.log(client.hosts);
    res.setHeader('Content-Type', 'application/json');
    res.send({result: 'OK', hosts: [client.hosts]});
});

module.exports = router;
