"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "Content",
    embedded: false
  },
  {
    name: "User",
    embedded: false
  },
  {
    name: "ShoutInVoid",
    embedded: false
  },
  {
    name: "ReplyToShoutInVoid",
    embedded: false
  },
  {
    name: "SavedReplyToShoutInVoid",
    embedded: false
  },
  {
    name: "SavedShout",
    embedded: false
  },
  {
    name: "EchoEdge",
    embedded: false
  },
  {
    name: "EchoInVoid",
    embedded: false
  },
  {
    name: "ReplyToEchoInVoid",
    embedded: false
  },
  {
    name: "SavedReplyToEchoInVoid",
    embedded: false
  },
  {
    name: "SavedEcho",
    embedded: false
  },
  {
    name: "NVoid",
    embedded: false
  },
  {
    name: "SavedVoid",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `http://localhost:4466`
});
exports.prisma = new exports.Prisma();
