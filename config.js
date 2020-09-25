module.exports = {
  url: "<hasura-graphql-endpoint>",
  query: "<mutation-query>",
  headers: {
    "content-type": "application/json",
    "x-hasura-admin-secret": "<hasura-admin-secret>"
  }
}
