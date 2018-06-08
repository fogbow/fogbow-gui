import sys, os, re, shutil, json, urllib, urllib2, BaseHTTPServer

reload(sys)
sys.setdefaultencoding('utf8')

here = os.path.dirname(os.path.realpath(__file__))

records = {}

def get_records(handler):
    return records

def get_record(handler):
    key = urllib.unquote(handler.path[8:])
    return records[key] if key in records else None

def set_record(handler):
    key = urllib.unquote(handler.path[8:])
    payload = handler.get_payload()
    records[key] = payload
    return records[key]

def delete_record(handler):
    key = urllib.unquote(handler.path[8:])
    del records[key]
    return True

def rest_call_json(url, payload=None, with_payload_method='PUT'):
    if payload:
        if not isinstance(payload, basestring):
            payload = json.dumps(payload)
        response = urllib2.urlopen(MethodRequest(url, payload, {'Content-Type': 'application/json'}, method=with_payload_method))
    else:
        response = urllib2.urlopen(url)
    response = response.read().decode()
    return json.loads(response)

def get_computes(handler):
    print "Getting computes..."
    return {}

def get_compute(handler):
    print "Getting compute..."
    key = urllib.unquote(handler.path[10:])
    if key is "0":
        print "Bad Request"
        bad_request_status = 400
        handler.set_response_status_code(bad_request_status)
        return {}
    return {}

def create_compute(handler):
    print "Creating compute..."
    payload = handler.get_payload()
    print payload
    return {}

def delete_compute(handler):
    print "Deleting compute..."
    return {}

def get_networks(handler):
    print "Getting networks..."
    return [{"id": "id1", "state": "state"}, {"id": "id2", "state": "state"}]

def get_network(handler):
    print "Getting network..."
    key = urllib.unquote(handler.path[10:])
    if key is "0":
        print "Bad Request"
        bad_request_status = 400
        handler.set_response_status_code(bad_request_status)
        return {}
    return {}

def create_network(handler):
    print "Creating network..."
    payload = handler.get_payload()
    print payload
    return {}

def delete_network(handler):
    print "Deleting network..."
    return {}

def get_members(handler):
    print "Getting members..."
    return ["Member Fake 1", "Member Fake 2", "Member Fake 3"]

class MethodRequest(urllib2.Request):
    def __init__(self, *args, **kwargs):
        if 'method' in kwargs:
            self._method = kwargs['method']
            del kwargs['method']
        else:
            self._method = None
        return urllib2.Request.__init__(self, *args, **kwargs)

    def get_method(self, *args, **kwargs):
        return self._method if self._method is not None else urllib2.Request.get_method(self, *args, **kwargs)

class RESTRequestHandler(BaseHTTPServer.BaseHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.routes = {
            r'^/computes$': {'GET': get_computes, 'POST': create_compute, 'DELETE': delete_compute,'media_type': 'application/json'},
            r'^/computes/': {'GET': get_compute, 'media_type': 'application/json'},

            r'^/networks$': {'GET': get_networks, 'POST': create_network, 'DELETE': delete_network,'media_type': 'application/json'},
            r'^/networks/': {'GET': get_network, 'media_type': 'application/json'},

	    r'^/membership/members': {'GET': get_members, 'media_type': 'application/json'},

            r'^/$': {'file': 'web/index.html', 'media_type': 'text/html'},
            r'^/records$': {'GET': get_records, 'media_type': 'application/json'},
            r'^/record/': {'GET': get_record, 'PUT': set_record, 'DELETE': delete_record, 'media_type': 'application/json'}}
        
        return BaseHTTPServer.BaseHTTPRequestHandler.__init__(self, *args, **kwargs)
    
    def do_HEAD(self):
        self.handle_method('HEAD')
    
    def do_GET(self):
        self.handle_method('GET')

    def do_POST(self):
        self.handle_method('POST')

    def do_PUT(self):
        self.handle_method('PUT')

    def do_DELETE(self):
        self.handle_method('DELETE')
    
    def get_payload(self):
        payload_len = int(self.headers.getheader('content-length', 0))
        payload = self.rfile.read(payload_len)
        payload = json.loads(payload)
        return payload

    def set_response_status_code(self, status_code):
        self.send_response(status_code)
        self.end_headers()
        self.wfile.write('Bad Request\n')
        
    def handle_method(self, method):
        route = self.get_route()
        if route is None:
            self.send_response(404)
            self.end_headers()
            self.wfile.write('Route not found\n')
        else:
            if method == 'HEAD':
                self.send_response(200)
                if 'media_type' in route:
                    self.send_header('Content-type', route['media_type'])
                self.end_headers()
            else:
                if 'file' in route:
                    if method == 'GET':
                        try:
                            f = open(os.path.join(here, route['file']))
                            try:
                                self.send_response(200)
                                if 'media_type' in route:
                                    self.send_header('Content-type', route['media_type'])
                                self.end_headers()
                                shutil.copyfileobj(f, self.wfile)
                            finally:
                                f.close()
                        except:
                            self.send_response(404)
                            self.end_headers()
                            self.wfile.write('File not found\n')
                    else:
                        self.send_response(405)
                        self.end_headers()
                        self.wfile.write('Only GET is supported\n')
                else:
                    if method in route:
                        content = route[method](self)
                        if content is not None:
                            self.send_response(200)
                            if 'media_type' in route:
                                self.send_header('Content-type', route['media_type'])
                            self.end_headers()
                            if method != 'DELETE':
                                self.wfile.write(json.dumps(content))
                        else:
                            self.send_response(404)
                            self.end_headers()
                            self.wfile.write('Not found\n')
                    else:
                        self.send_response(405)
                        self.end_headers()
                        self.wfile.write(method + ' is not supported\n')
                    
    
    def get_route(self):
        for path, route in self.routes.iteritems():
            if re.match(path, self.path):
                return route
        return None

def rest_server(port):
    'Starts the REST server'
    http_server = BaseHTTPServer.HTTPServer(('', port), RESTRequestHandler)
    print 'Starting HTTP server at port %d' % port
    try:
        http_server.serve_forever()
    except KeyboardInterrupt:
        pass
    print 'Stopping HTTP server'
    http_server.server_close()

def main(argv):
    rest_server(8185)

if __name__ == '__main__':
    main(sys.argv[1:])
