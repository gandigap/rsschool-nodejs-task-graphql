import { PrismaClient } from "@prisma/client";

export interface ID {
    id: string;
};

export type Data = Record<string | number | symbol, never>;

export interface Context {
  prisma: PrismaClient;
}