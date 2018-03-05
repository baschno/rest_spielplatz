# Bottle REST API with Cassandra in Docker

## Requirements

Have a workingn Docker & Python setup.

Create a Python virtualenv and activate it:
```
virtualenv venv
source venv/bin/activate
```

Install Python dependencies:
```
pip install -r requirements.txt
```


Run Cassandra [1]:
```
./docker-compose up -d
```

Check that Cassandra is running
```
docker exec cassandra1 nodetool status
```

See the contents of your Cassandra:
```
docker exec -it cassandra0 cqlsh

#create keyspace and table
CREATE KEYSPACE mykeyspace WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '3'}  AND durable_writes = true;

CREATE TABLE mykeyspace.mytable (
    mykey text,
    name text,
    PRIMARY KEY (mykey, name)
) WITH CLUSTERING ORDER BY (name ASC)
    AND bloom_filter_fp_chance = 0.01
    AND caching = {'keys': 'ALL', 'rows_per_partition': 'NONE'}
    AND comment = ''
    AND compaction = {'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4'}
    AND compression = {'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND crc_check_chance = 1.0
    AND dclocal_read_repair_chance = 0.1
    AND default_time_to_live = 0
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair_chance = 0.0
    AND speculative_retry = '99PERCENTILE';


cqlsh> select * from mykeyspace.mytable;
```

[1] - Cassandra on Docker and Python https://mannekentech.com/2017/11/11/playing-with-docker-and-cassandra/
[2] - https://www.toptal.com/bottle/building-a-rest-api-with-bottle-framework
