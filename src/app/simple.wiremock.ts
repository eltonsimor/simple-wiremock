import * as http from 'http';

export class SimpleWiremock {
    public static PORT: any;

    private isRandomPort = false;
    private connections = [];
    private assertions;
    private server;
    private defaultPort = 5001;

    constructor() {
        this.assertions = {};

        this.server = http.createServer((req, res) => {
            const keygen = this.generateKey(req.method, req.url);
            const response = this.assertPosition(keygen);
            this.allowCrossDomain(res);
            if (response != null) {
                res.writeHead(response.assertion.status, response.assertion.headers);
                res.end(JSON.stringify(response.assertion.body));
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('No Matching Response!\n');
                throw new Error('No Match For: ' + req.method + ' ' + req.url);
            }
        });

        SimpleWiremock.PORT = this.defaultPort;
    }

    get(url: string, response: any) {
        this.assert('GET', url, response.body, response.status, response.headers);
    }
    
    post(url: string, response: any) {
        this.assert('POST', url, response.body, response.status, response.headers);
    }

    put(url: string, response: any) {
        this.assert('PUT', url, response.body, response.status, response.headers);
    }

    patch(url: string, response: any) {
        this.assert('PATCH', url, response.body, response.status, response.headers);
    }

    options(url: string, response: any) {
        this.assert('OPTIONS', url, response.body, response.status, response.headers);
    }

    head(url: string, response: any) {
        this.assert('HEAD', url, response.body, response.status, response.headers);
    }

    delete(url: string, response: any) {
        this.assert('DELETE', url, response.body, response.status, response.headers);
    }

    start() { 
        this.server.listen(SimpleWiremock.PORT, () => {
            //console.log(`Listening port: ${SimpleWiremock.PORT}`);
        });

        this.server.on('connection', connection => {
            this.connections.push(connection);
            connection.on('close', () => this.connections = this.connections.filter(curr => curr !== connection));
        });
        return this;
    }

    stop() {
       this.server.close();
       this.connections.forEach(curr => curr.end());
    }

    enableRandomPort(){
        SimpleWiremock.PORT = this.randomPort();
        return this;
    }

    setPort(port: number){
        SimpleWiremock.PORT = port;
        return this;
    }

    private randomPort(){
        return Math.trunc(this.defaultPort + (Math.random() * 500));
    }

    private assert(httpMethod, path, objectBody, statusCode, httpHeaders) {
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

    private assertPosition(key) {
        return this.assertions[key];
    }

    private generateKey(method, path) {
        return `${method}|${path}`;
    }

    private allowCrossDomain(res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', '*');
        res.setHeader('Access-Control-Allow-Headers', '*');
    }
}
