import * as http from 'http';

interface Assertion {
    method: string,
    path: string,
    body: any,
    status: number,
    headers: any
}

export class SimpleWiremock {
    public static PORT: any;

    private connections: any = [];
    private readonly assertions:  Record<string, Array<Assertion>>;
    private server: http.Server;
    private defaultPort = 5001;

    constructor() {
        this.assertions = {};

        this.server = http.createServer((req, res) => {
            const keygen = this.generateKey(String(req.method), String(req.url));
            const response = this.assertPosition(keygen);
            this.allowCrossDomain(res);
            if (response != null) {
                res.writeHead(response.status, response.headers);
                res.end(JSON.stringify(response.body));
            } else {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('No Matching Response!\n');
                throw new Error('No Match For: ' + req.method + ' ' + req.url);
            }
        });

        SimpleWiremock.PORT = this.defaultPort;
    }

    instance() {
        return new SimpleWiremock();
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
            connection.on('close', () => this.connections = this.connections.filter((curr: import("net").Socket) => curr !== connection));
        });
        return this;
    }

    stop() {
        this.server.close();
        this.connections.forEach((curr: { end: () => any; }) => curr.end());
    }

    enableRandomPort() {
        SimpleWiremock.PORT = this.randomPort();
        return this;
    }

    setPort(port: number) {
        SimpleWiremock.PORT = port;
        return this;
    }

    private randomPort() {
        return Math.trunc(this.defaultPort + (Math.random() * 500));
    }

    private assert(httpMethod: string, path: string, objectBody: any, statusCode: number, httpHeaders: any) {
        const keygen = this.generateKey(httpMethod, path);

        let assertionList: Array<Assertion> = this.assertions[keygen];
        if (assertionList === null || assertionList === undefined) {
            assertionList = new Array<Assertion>();
            this.assertions[keygen] = assertionList;
        }
        assertionList.push({
            body: objectBody,
            status: statusCode,
            method: httpMethod,
            headers: httpHeaders,
            path: path
        });
    }

    private assertPosition(key: string): Assertion {
        return this.assertions[key].reverse().pop();
    }

    private generateKey(method: string, path: string) {
        return `${method}|${path}`;
    }

    private allowCrossDomain(res: any) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', '*');
        res.setHeader('Access-Control-Allow-Headers', '*');
    }
}


