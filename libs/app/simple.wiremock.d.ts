export declare class SimpleWiremock {
    static PORT: any;
    private connections;
    private assertions;
    private server;
    private defaultPort;
    constructor();
    instance(): SimpleWiremock;
    get(url: string, response: any): void;
    post(url: string, response: any): void;
    put(url: string, response: any): void;
    patch(url: string, response: any): void;
    options(url: string, response: any): void;
    head(url: string, response: any): void;
    delete(url: string, response: any): void;
    start(): this;
    stop(): void;
    enableRandomPort(): this;
    setPort(port: number): this;
    private randomPort;
    private assert;
    private assertPosition;
    private generateKey;
    private allowCrossDomain;
}
