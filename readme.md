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
) WITH CLUSTERING ORDER BY (name ASC);


cqlsh> select * from mykeyspace.mytable;
```

[1] - Cassandra on Docker and Python https://mannekentech.com/2017/11/11/playing-with-docker-and-cassandra/
[2] - https://www.toptal.com/bottle/building-a-rest-api-with-bottle-framework
