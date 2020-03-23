const request = require('supertest'),
  app = require('../server/config/express'),
  domains = require('../assets/lib/rule-34-shared-resources/booru-list.json')

/* ---------------- TAGS ---------------- */
describe.each(domains)('Tags', (domain) => {
  // Valid integer count
  it(`Route ${domain.short} responds with valid count`, function (done) {
    request(app)
      .get(`/${domain.short}/tags?tag=pok`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      // Custom
      .expect(function (res) {
        // Check
        res.body.forEach((element) => {
          if (!Number.isInteger(element.count)) {
            throw new Error('Count is not an int')
          }
        })
      })
      // End
      .end(function (err) {
        if (err) return done(err)
        done()
      })
  })

  //  Array length
  it(`Route ${domain.short} responds with valid tag length`, function (done) {
    request(app)
      .get(`/${domain.short}/tags?tag=pok&limit=5`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      // Custom
      .expect(function (res) {
        //   Array length check
        if (res.body.length !== 5) {
          throw new Error('Response is longer than it should', res.body.length)
        }
      })
      // End
      .end(function (err) {
        if (err) return done(err)
        done()
      })
  })
})