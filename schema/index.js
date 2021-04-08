const { buildSchema } = require("graphql");

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    shortenUrl(url: String!): URL
  }

  type URL {
    shortened_url: String!
  }
`);

module.exports = schema;
