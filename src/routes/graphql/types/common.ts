import { PrismaClient } from "@prisma/client";
import { DataLoaders } from "../dataLoaders/dataLoaders.js";

export interface ID {
    id: string;
};

export type Data = Record<string | number | symbol, never>;

export interface Context extends DataLoaders{
  prisma: PrismaClient;
}

export interface Subscription {
  subscriberId: string;
  authorId: string;
}

export interface SubscriptionMutation {
  userId: string;
  authorId: string;
}
