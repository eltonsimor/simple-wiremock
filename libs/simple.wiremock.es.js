import { createServer } from 'http';

class SimpleWiremock {
    constructor() {
        this.connections = [];
        this.defaultPort = 5001;
        this.assertions = {};
        this.server = createServer((req, res) => {
            const keygen = this.generateKey(String(req.method), String(req.url));
            const response = this.assertPosition(keygen);
            this.allowCrossDomain(res);
            if (response != null) {
                res.writeHead(response.assertion.status, response.assertion.headers);
                res.end(JSON.stringify(response.assertion.body));
            }
            else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('No Matching Response!\n');
                throw new Error('No Match For: ' + req.method + ' ' + req.url);
            }
        });
        SimpleWiremock.PORT = this.defaultPort;
    }
    instance() {
        return new SimpleWiremock();
    }
    get(url, response) {
        this.assert('GET', url, response.body, response.status, response.headers);
    }
    post(url, response) {
        this.assert('POST', url, response.body, response.status, response.headers);
    }
    put(url, response) {
        this.assert('PUT', url, response.body, response.status, response.headers);
    }
    patch(url, response) {
        this.assert('PATCH', url, response.body, response.status, response.headers);
    }
    options(url, response) {
        this.assert('OPTIONS', url, response.body, response.status, response.headers);
    }
    head(url, response) {
        this.assert('HEAD', url, response.body, response.status, response.headers);
    }
    delete(url, response) {
        this.assert('DELETE', url, response.body, response.status, response.headers);
    }
    start() {
        this.server.listen(SimpleWiremock.PORT, () => {
            //console.log(`Listening port: ${SimpleWiremock.PORT}`);
        });
        this.server.on('connection', connection => {
            this.connections.push(connection);
            connection.on('close', () => this.connections = this.connections.filter((curr) => curr !== connection));
        });
        return this;
    }
    stop() {
        this.server.close();
        this.connections.forEach((curr) => curr.end());
    }
    enableRandomPort() {
        SimpleWiremock.PORT = this.randomPort();
        return this;
    }
    setPort(port) {
        SimpleWiremock.PORT = port;
        return this;
    }
    randomPort() {
        return Math.trunc(this.defaultPort + (Math.random() * 500));
    }
    assert(httpMethod, path, objectBody, statusCode, httpHeaders) {
        const keygen = this.generateKey(httpMethod, path);
        this.assertions[keygen] = {
            key: keygen,
            assertion: {
                body: objectBody,
                status: statusCode,
                method: httpMethod,
                headers: httpHeaders
            }
        };
    }
    assertPosition(key) {
        return this.assertions[key];
    }
    generateKey(method, path) {
        return `${method}|${path}`;
    }
    allowCrossDomain(res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', '*');
        res.setHeader('Access-Control-Allow-Headers', '*');
    }
}

export { SimpleWiremock };
//# sourceMappingURL=simple.wiremock.es.js.map
