const app = require('../src/app');

describe('App', () => {
  it('GET / responds with 200', () => {
    return supertest(app)
      .get('/')
      .set({'Authorization': 'Bearer a660a6da-6d89-4d36-9331-e049c176ad9a'})
      .expect(200);
  });
});