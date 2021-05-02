const express = require("express");
const dotenv = require("dotenv");
const schema = require("./schema/schema");
const graphQLHTTP = require("express-graphql").graphqlHTTP;

dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();


app.use('/graphql', graphQLHTTP({
    schema,
    graphiql: true
}));

app.listen(PORT, () => {
  try {
    console.log(`Server is running on PORT ${PORT}`);
  } catch (e) {
    console.info(e || "Unable to start server");
  }
});
