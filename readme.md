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

```
docker exec -it cassandra0 cqlsh
```

[1] - Cassandra on Docker and Python https://mannekentech.com/2017/11/11/playing-with-docker-and-cassandra/
[2]
