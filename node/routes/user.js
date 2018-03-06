var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');

var client = new cassandra.Client({contactPoints: ['127.0.0.1']});

var getByUserKey = "SELECT * FROM mykeyspace.mytable WHERE mykey = ?";
/* GET users listing. */
router.get('/:id', function(req, res, next) {
  console.log(req.params.id);
  client.execute(getByUserKey, [req.params.id], function(err, result){
    if (err) {
      res.status(404).send({msg: err});
    } else {
      res.json(result.rows[0]);
    }
  })
});

module.exports = router;
