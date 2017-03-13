import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import app from '../server/config/express';
chai.use(chaiHttp);
const expect = chai.expect;
describe('Ruta de Prueba', () => {
    it('debe tener un status de 200 y una propiedad mensaje', (done) => {
        chai.request(app).get('/').end((err, res) => {
            expect(err).to.be.null;
            expect(res.status).to.equal(200);
            expect(res).to.be.json;
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.equal('Hello World (^.^)');
            done();
        });
    });
});
