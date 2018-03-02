var express = require("express");
var router = express.Router();
var cassandra = require("cassandra-driver");

var client = new cassandra.Client({ contactPoints: ["127.0.0.1"] });

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
