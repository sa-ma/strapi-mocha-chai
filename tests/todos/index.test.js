const fs = require('fs');
const { setupStrapi } = require('../helpers/strapi');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

let app;

before(async () => {
  app = await setupStrapi();
});

after((done) => {
  const dbSettings = app.config.get('database.connections.default.settings');

  if (dbSettings && dbSettings.filename) {
    const tmpDbFile = `${__dirname}/../${dbSettings.filename}`;
    if (fs.existsSync(tmpDbFile)) {
      fs.unlinkSync(tmpDbFile);
    }
  }
  done();
});


it('creates a todo item', (done) => {
  chai
    .request(app.server)
    .post('/todos/')
    .send({
      "title": "Sample 2",
      "completed": true
    }).end((error, response) => {
      expect(response).to.have.status(200);
      expect(response).to.have.property('body');
      expect(response.body).to.have.property('title');
      done();
    })
});

it('updates a todo item', (done) => {
  chai
    .request(app.server)
    .put('/todos/1')
    .send({
      "title": "Updated todo",
      "completed": true
    }).end((error, response) => {
      expect(response).to.have.status(200);
      expect(response).to.have.property('body');
      expect(response.body.title).to.equal('Updated todo');
      done();
    })
});

it('gets the list of all todos', (done) => {
  chai
    .request(app.server)
    .get('/todos')
    .end((error, response) => {
      expect(response).to.have.status(200);
      expect(response.body).to.be.an('array');
      done();
    })
});

it('gets a todo item', (done) => {
  chai
    .request(app.server)
    .get('/todos/1')
    .end((error, response) => {
      expect(response).to.have.status(200);
      expect(response.body).to.be.an('object');
      done();
    })
});

it('deletes a todo item', (done) => {
  chai
    .request(app.server)
    .delete('/todos/1')
    .end((error, response) => {
      expect(response).to.have.status(200);
      expect(response.body).to.be.an('object');
      done();
    })
});

