import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import fetch from "node-fetch";
import { config as dotenvConfig } from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenvConfig();
}

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  const _token = Buffer.from(
    `67e467c5-69fa-4b97-92f5-1b9acdcce21a:409f1a1536464a6d9c60c9bd048252d1`
  ).toString("base64");
  fetch(`${process.env.MTN_MOMO_BASE}/collection/token/`, {
    method: "post",
    headers: {
      Authorization: `Bearer ${_token}`,
      "Ocp-Apim-Subscription-Key": `${process.env.MTN_MOMO_SUBSCRIPTION_KEY}`,
      "X-Target-Environment": `${process.env.MTN_MOMO_ENVIRONMENT}`,
    },
  })
    .then(async (response) => {
      if (response.status === 200) {
        const _data: any = await response.json();
        const access_token = _data.access_token;
        //@ts-ignore
        req.token = access_token;
        next();
      }
    })
    .catch((err) => {
      next(err || "Invalid token");
    });
});

export const payfamAPI = functions.https.onRequest(app);

app.post("/get-access-token", async (req, res) => {
  //@ts-ignore
  res.send({ access_token: req.token });
});

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
