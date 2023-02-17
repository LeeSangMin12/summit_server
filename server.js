import express from "express";
import { default as mongodb } from 'mongodb';
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();  //env 파일 가져오기
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
} = process.env;

const app = express();
const MongoClient = mongodb.MongoClient;
let db;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());  //모든 cors 오픈


MongoClient.connect('mongodb+srv://tkdals0920:000920@cluster0.ehjfw8p.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true }, (err, client) => {
  if (err) return console.log(err);
  db = client.db('summit');

  app.listen(8080, () => {
    console.log("listening on 8080");
  });
});

app.post("/login", async (req, res) => {
  const authorization_code = req.body.data.in1;

  if (req.body.data.p_nm === "google_login") {
    const token_info = await get_token(authorization_code);
    const email_address = await get_email(token_info);

    db.collection("login").findOne({ email: email_address }, (err, result) => {
      if (result !== null) {
        res.send("ok");
      } else {
        res.send("");
      }
    });

  }
});

/**
 * 구글에서 사용자의 토큰 정보를 가져온다.
 */
const get_token = async (authorization_code) => {
  const GOOGLE_AUTH_URL =
    `https://www.googleapis.com/oauth2/v4/token?` +
    `grant_type=authorization_code&` +
    `code=${authorization_code}&` +
    `client_id=${GOOGLE_CLIENT_ID}&` +
    `client_secret=${GOOGLE_CLIENT_SECRET}&` +
    `redirect_uri=${GOOGLE_REDIRECT_URI}&`;

  const token_info = await axios
    .post(GOOGLE_AUTH_URL, {
      headers: { "content-type": "application/x-www-form-urlencoded" },
    })
    .then((el) => {
      return el.data;
    })
    .catch((err) => {
      console.log("err", err);
    });

  return token_info;
};

/**
 * access token으로 사용자의 이메일 주소를 받아온다.
 */
const get_email = async (token_info) => {
  const access_token = token_info.access_token;
  const user_info_url = `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`;

  const user_info = await axios
    .get(user_info_url, {
      headers: {
        authorization: `Bearer ${access_token}`,
      },
    })
    .then((el) => {
      return el.data;
    })
    .catch((err) => {
      console.log("err", err);
    });

  const email_address = user_info.email;
  return email_address;
};


