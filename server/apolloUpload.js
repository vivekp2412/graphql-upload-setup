// server.js
const { ApolloServer, gql } = require("apollo-server");

const { Upload } = require("graphql-upload");

const fs = require("fs");

const typeDefs = gql`
  scalar Upload

  type Mutation {
    uploadFile(file: Upload!): String!
  }
`;

const resolvers = {
  Upload: Upload,

  Mutation: {
    uploadFile: async (_, { file }) => {
      const { createReadStream, filename } = await file;
      const stream = createReadStream();
      const path = `uploads/${filename}`;
      await new Promise((resolve, reject) =>
        stream
          .pipe(fs.createWriteStream(path))
          .on("finish", resolve)
          .on("error", reject)
      );
      return `File saved at: ${path}`;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen(7000).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
