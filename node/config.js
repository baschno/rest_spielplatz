if (process.argv.length > 2) 
    seednodes = process.argv[2];
else
    seednodes = '0.0.0.0'

var config = {};
config.cassandra_seednodes = seednodes;

module.exports = config;