const express = require("express");
const router = express.Router();
const cassandra = require("cassandra-driver");
const config = require("../config");

const node_list = ["0.0.0.0", "172.18.0.2", "172.18.0.3", "172.18.0.4"];

function checkHost(ip) {
    let promise = new Promise(function (resolve, reject) {
        let client = new cassandra.Client({
            contactPoints: [ip]
        });

        client
            .connect()
            .then(function (x) {
                console.log("connected to " + ip);
                return ip;
            })
            .then(function (data) {
                client.shutdown();
                resolve({ ip: ip, ok: true});
            })
            .catch(function (err) {
                if (err instanceof cassandra.errors.NoHostAvailableError) {
                    console.log("Host not reachable.");
                }
                console.log(ip + " down");
                resolve({ ip: ip, ok: false });
            }
            );
    });

    return promise;
}

/* GET home page. */
router.get("/", function (req, res, next) {

    Promise.all(node_list.map(node => checkHost(node)))
        .then(function (x) {
            console.log("fine.");
            res.setHeader('Content-Type', 'application/json');
            const result = x.reduce((acc, curr) => {
                if(curr.ok) {
                    acc.succeededHosts.push(curr.ip);
                } else {
                    acc.failedHosts.push(curr.ip);
                }; 
                return acc;
            }, { succeededHosts: [], failedHosts: []});
            result.overallResult = result.failedHosts.length > 0 ? 'NOK' : 'OK';
            res.json(result);
        })
        .catch(function (err) {
            console.log("Er: " + err);
            res.status(401);
        });
});

module.exports = router;
