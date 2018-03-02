var cassandra = require('cassandra-driver')
var async = require('async')

var client = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'mykeyspace'})
console.log('VorConnect');
client.connect(function(err, result) {
    if (!err) {
        console.log('Error on connect');
    } else
        console.log('Connected...');
})
console.log(client)

console.log('VorExecute');
client.execute("SELECT mykey, name FROM mytable", function (err, result) {
    if (!err) {
        if ( result.rows.length > 0) {
            var row = result.rows[0];
            console.log('name = %s', row.name);
        } else {
            console.log("No results...");
        }
    }
    else
        console.log('Error on querying....')
})


process.exit();