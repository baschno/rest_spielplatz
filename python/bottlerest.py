import bottle
from api import cassandra_connect
from api import names

app = application = bottle.default_app()

if __name__ == '__main__':
    cassandra_connect.setup_connection()
    bottle.run(host = '127.0.0.1', port = 8000)
