const express = require("express");
const router = express.Router();
const cassandra = require("cassandra-driver");
const config = require("../config");

const node_list = ["0.0.0.0", "172.18.0.2", "172.18.0.3", "172.18.0.4"];
const succ_list = [];
const err_list = [];
const promises = [];

function checkHost(ip) {
  let promise = new Promise(function(resolve, reject) {
    let client = new cassandra.Client({
      contactPoints: [ip]
    });

    client
      .connect()
      .then(function(x) {
        console.log("connected nicely to " + ip);
        return ip;
      })
      .then(function(data) {
          console.log("Shutting down connection.")
          client.shutdown();
          resolve(ip);
      })
      .catch(function(err) {
            if (err instanceof cassandra.errors.NoHostAvailableError) {
              console.log("Host not reachable.");
            }
            console.log("Rejecting " + ip + " now");
            reject(err);
            }
        );
  });

  return promise;
}

node_list.forEach(ip => {
    promises.push(
        checkHost(ip)
    );
});

Promise.all(promises)
  .then(function(x) {
    console.log("fine.");
  })
  .catch(function(err) {
    console.log("Er: " + err);
  });

//checkHost(node_list[0]);

// promises = [checkHost("0.0.0.0"), checkHost("172.18.0.4")];
// Promise.all(promises).then(function(x) {
//     console.log("fine.");
// }).catch(function(err){
//     console.log("Error: " + err);
// })

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
