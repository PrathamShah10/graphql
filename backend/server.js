import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";



mongoose.connect('mongodb://localhost:27017/gqldb',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log('connected to mongoDB');
});

import './modals/User.js';
import './modals/Quote.js';
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => {
    const {authorization} = req.headers;
    if(authorization) {
      const {userId} = jwt.verify(authorization, 'avbdd!@#$]');
      return {userId: userId};
    }
  },
});
console.log(`🚀 Server ready at ${url}`);