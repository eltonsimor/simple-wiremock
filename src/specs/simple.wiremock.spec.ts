import { SimpleWiremock } from '../app/simple.wiremock';
import { before } from 'mocha';


const should = require('should');
const request = require('request');

describe('SimpleWiremock', () => {
    
    describe("Should do simple request", () => {
        let simpleWiremock: SimpleWiremock;
    
        before(() => {
            simpleWiremock = new SimpleWiremock().start();
            simpleWiremock.get("/users", {
                status: 200,
                headers: {"Content-Type": "applications"},
                body: {
                    name: 'Austin Power',
                    age: 60
                }
            });
        });

        it("Should get different users for same http call", (done) => {
            simpleWiremock.get("/users", {
                status: 200,
                headers: {"Content-Type": "applications"},
                body: {
                    name: 'Power ranger',
                    age: 70
                }
            });
            request('http://localhost:5001/users', (err: any, res: any, body: string) =>{
                should.not.exist(err);
                should.exist(res);
                JSON.parse(body).should.containDeep({ name: 'Austin Power', age: 60 });
                request('http://localhost:5001/users', (err: any, res: any, body: string) =>{
                    should.not.exist(err);
                    should.exist(res);
                    JSON.parse(body).should.containDeep({ name: 'Power ranger', age: 70 });
                    done();
                });
            });

        });
    
        after(() => {
            simpleWiremock.stop();
        });
    });

});
