import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import serverless from "serverless-http";
import express from "express";
import { AppModule } from "./app.module";

let cachedHandler: serverless.Handler;

async function bootstrap() {
  if (cachedHandler) {
    return cachedHandler;
  }
  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  await app.init();
  cachedHandler = serverless(expressApp);
  return cachedHandler;
}

export default async function handler(req: any, res: any) {
  const fn = await bootstrap();
  return fn(req, res);
}

