import bottle
import re
import json

from bottle import request, response
from bottle import post, get, put, delete

import cassandra_connect

namepattern = re.compile(r'^[a-zA-Z\d]{1,64}$')

@post('/names')
def creation_handler():
    '''Handles name creation'''
    _names = cassandra_connect.list_names()
    try:
        try:
            #parse input
            data = request.json
        except Exception as e:
            print("Error happened %s " % e.message)
            raise ValueError
        pass

        if data is None:
            raise ValueError

        #extract and validate name
        try:
            if namepattern.match(data['name']) is None:
                raise ValueError
            name = data['name']
        except (TypeError, KeyError):
            raise ValueError

        # check existence
        if name in _names:
            raise KeyError
    except ValueError:
        response.status = 400
        return

    cassandra_connect.insert_name(name)

    response.headers['Content-Type'] = 'application/json'
    return json.dumps({'name': name})

@get('/names')
def listing_handler():
    '''Handles name listing'''
    response.headers['Content-Type'] = 'application/json'
    response.headers['Cache-Control'] = 'no-cache'
    return json.dumps({'names':list(cassandra_connect.list_names())})


@put('/names/<name>')
def update_handler(name):
    '''Handles name updates'''
    _names = cassandra_connect.list_names()
    try:
        try:
            data = json.load(request.body)
        except:
            raise ValueError

        try:
            if namepattern.match(data['name']) is None:
                raise ValueError
            newname = data['name']
        except TypeError, KeyError:
            raise ValueError

        if name not in _names:
            raise KeyError(404)

        if newname in _names:
            raise KeyError(409)
    except ValueError:
        response.status = 400
        return

    except KeyError as e:
        response.status = e.args[0]
        return

    cassandra_connect.remove_name(name)
    cassandra_connect.insert_name(newname)

    response.headers['Content-Type'] = 'application/json'
    return json.dumps({'name':newname})


@delete('/names/<name>')
def delete_handler(name):
    '''Handles name deletions'''
    try:
        _names = cassandra_connect.list_names()
        if name not in _names:
            raise KeyError

    except KeyError:
        response.status = 404
        return

    # remove stuff
    cassandra_connect.remove_name(name)
    return


app = application = bottle.default_app()

if __name__ == '__main__':
    cassandra_connect.setup_connection()
    bottle.run(host = '127.0.0.1', port = 8000)
