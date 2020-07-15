const fs = require('fs');
const { setupStrapi } = require('./helpers/strapi');
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

it('strapi is defined', (done) => {
  expect(app).to.exist;
  done()
});

