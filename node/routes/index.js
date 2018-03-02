var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');

var client = new cassandra.Client({contactPoints: ['127.0.0.1']});

const query = "SELECT * from mykeyspace.mytable";
client.execute(query).then(result => console.log('Result %s', result.rows[0].name));

/* GET home page. */
router.get('/', function(req, res, next) {
  client.execute(query, function(err, result) {
    if (err) {
      res.status(404).send({msg: err});
    } else {
      res.render('index', {
        title: 'Cassandra Connection',
        users: result.rows
      })
    }
  })
});

module.exports = router;
