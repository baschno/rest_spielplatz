import logging

log = logging.getLogger()
log.setLevel(logging.INFO)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(name)s: %(message)s"))
log.addHandler(handler)

from cassandra.cluster import Cluster

KEYSPACE = "mykeyspace"
local_session = None


def setup_connection():
    global local_session
    if local_session is None:
        cluster = Cluster(['127.0.0.1'], port=9042)
        local_session = cluster.connect()
        local_session.set_keyspace(KEYSPACE)

    return local_session


def initialize():
    ses = setup_connection()
    ses.execute("""
                CREATE KEYSPACE IF NOT EXISTS %s
                WITH replication = { 'class': 'SimpleStrategy', 'replication_factor': '3' }
                """ % KEYSPACE)

    ses.set_keyspace(KEYSPACE)

    ses.execute("""
             CREATE TABLE IF NOT EXISTS mytable (
                 mykey text,
                 name text,
                 PRIMARY KEY (mykey, name)
             )
             """)


def gen_db_key(name):
    return "rec_key_%s" % name.lower()


def insert_name(name):
    session = setup_connection()
    query = "INSERT INTO mytable (mykey, name) VALUES (?,?)"
    prepared = session.prepare(query)
    session.execute(prepared, ((gen_db_key(name), name)))


def list_names():
    resultSet = set()
    session = setup_connection()
    query = "select * from mytable"
    rows = session.execute(query)
    for row in rows:
        resultSet.add(row.name)
    return resultSet

def remove_name(name):
    session = setup_connection()
    query = "delete from mytable where mykey = '%s'" % gen_db_key(name)
    session.execute(query)


if __name__ == '__main__':
    initialize()
    list_names()


