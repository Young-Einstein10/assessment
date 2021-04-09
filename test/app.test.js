const { expect, assert } = require("chai");
const app = require("../app");
const request = require("supertest");

describe("Test GraphQL Server", () => {
  it("should return a Not Found Message", (done) => {
    request(app)
      .get("/unknown")
      .expect(404)
      .end((err, res) => {
        assert.equal(res.body, "No URL Found");

        if (err) return done(err);
        done();
      });
  });

  it("should return an error object when request parameters are invalid", (done) => {
    request(app)
      .get("/hhjg")
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.body).to.have.property("status");
        expect(res.body).to.have.property("message");
        expect(res.body.status).to.equal("error");
        expect(res.body.message).to.equal("Incomplete URL");

        done();
      });
  });

  it("should return a shortened URL when a url is passed", (done) => {
    let url =
      "https://vasanthk.gitbooks.io/react-bits/content/patterns/19.async-nature-of-setState.html";

    request(app)
      .post("/graphql")
      .send({
        query: `{ shortenUrl(url: "${url}") { shortened_url } }`,
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.body).to.have.property("data");
        expect(res.body.data.shortenUrl).to.have.property("shortened_url");

        done();
      });
  });
});
