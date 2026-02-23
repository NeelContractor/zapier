export { prisma } from "./client"; // exports instance of prisma
export * from "../generated/prisma/client"; // exports generated types from prisma

// import { PrismaClient } from "@prisma/client";

// const prismaClientSingleton = () => new PrismaClient(); // Prisma 7 automatically reads the datasource

// declare global {
//   var prismaGlobal: PrismaClient | undefined;
// }

// export const prisma =
//   globalThis.prismaGlobal ?? prismaClientSingleton();

// if (process.env.NODE_ENV !== "production") {
//   globalThis.prismaGlobal = prisma;
// }

// export default prisma;

// export { default as prisma } from "./client";
// export * from "../generated/prisma/client"; // exports generated types from prisma