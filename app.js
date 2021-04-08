const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { createUrlTable } = require("./models");
const routes = require("./routes");
const shortenUrlResolvers = require("./resolvers");
const schema = require("./schema");

const app = express();

// The root provides a resolver function for each API endpoint
const root = {
  shortenUrl: shortenUrlResolvers,
};

app.use(
  express.json({
    extended: false,
  })
); //parse incoming request body in JSON format.

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
    // context: { req },
    customFormatErrorFn: (error) => ({
      message: error.message,
      locations: error.locations,
      stack: error.stack ? error.stack.split("\n") : [],
      path: error.path,
    }),
  })
);

app.use(routes);

app.use("/*", (req, res) => {
  res.status(404).send("Not Found");
});

const PORT = process.env.PORT || 5000;

createUrlTable();

// Listen for incoming requests
app.listen(PORT, () => console.log(`Server Running on PORT ${PORT}`));
