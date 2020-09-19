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
    name: "VoteBucket",
    embedded: false
  },
  {
    name: "Vote",
    embedded: false
  },
  {
    name: "UserLocation",
    embedded: false
  },
  {
    name: "AdminStatus",
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
    name: "UserActivatedEchoOfShout",
    embedded: false
  },
  {
    name: "EchoOfShoutInVoid",
    embedded: false
  },
  {
    name: "ReplyToEchoOfShoutInVoid",
    embedded: false
  },
  {
    name: "NVoid",
    embedded: false
  },
  {
    name: "UserSavedVoid",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `http://localhost:4466`
});
exports.prisma = new exports.Prisma();
