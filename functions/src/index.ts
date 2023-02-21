import * as functions from "firebase-functions";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import * as express from "express";

const server = express();

const createNestServer = async (expressInstance) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance)
  );

  const config = new DocumentBuilder()
    .setTitle("Payfam serverless function API")
    .setDescription("Official documentation of Payfam serverless function api")
    .setVersion("1.0")
    .addBearerAuth()
    .addServer("http://127.0.0.1:5001/payfam-f5534/us-central1/api")
    .addServer("https://us-central1-payfam-f5534.cloudfunctions.net/api")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );
  app.enableCors();

  return app.init();
};

createNestServer(server)
  .then((v) => console.log("Nest js is ready"))
  .catch(() => console.error("Nest js is broken"));

export const api = functions.https.onRequest(server);
