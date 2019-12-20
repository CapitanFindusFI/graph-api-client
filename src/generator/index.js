const yargs = require('yargs');

const queryCommand = yargs.usage("Usage -q <query>")
  .option("q", {
    alias: "query",
    describe: "graphQL query",
    type: "string"
  }).argv;

const mutationCommand = yargs.usage("Usage -m <mutation>")
  .option("m", {
    alias: "mutation",
    describe: "graphQL mutation",
    type: "string"
  }).argv;

const query = `Generate query: ${queryCommand.query}`;
const mutation = `Generate mutation: ${mutationCommand.mutation}`;


console.log(query, mutation);
