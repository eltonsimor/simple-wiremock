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
                jsonBody: {
                    name: 'Austin Power',
                    age: 60
                }
            });
        });
    
        it("Sould get users for http", (done) => {
            request('http://localhost:5001/users', (err, res, body) =>{
                should.not.exist(err);
                should.exist(res);
                JSON.parse(body).should.containDeep({ name: 'Austin Power', age: 60 });
                done();
            });
        });
    
        after(() => {
            simpleWiremock.stop();
        });
    });

    describe('Should do simple request random port', () => {

        let simpleWiremock: SimpleWiremock;
    
        before(() => {
            simpleWiremock = new SimpleWiremock()
                                .enableRandomPort()
                                .start();

            simpleWiremock.get("/users", {
                status: 200,
                headers: {"Content-Type": "applications"},
                jsonBody: {
                    name: 'Elton Moraes',
                    age: 32
                }
            });
        });

        it('Should get users on random port', (done) => {
            let port = SimpleWiremock.PORT;

            request(`http://localhost:${port}/users`, (err, res, body) =>{
                should.not.exist(err);
                should.exist(res);
                JSON.parse(body).should.containDeep({ name: 'Elton Moraes', age: 32 });
                done();
            });
        });

        after(() => {
            simpleWiremock.stop();
        });
    });
});
