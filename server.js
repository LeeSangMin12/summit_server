const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const axios = require('axios');
const dotenv = require('dotenv');
const send_google_email = require("./js/libs/node_mailer.js");

dotenv.config();  //env 파일 가져오기

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_GRANT_TYPE,
  GOOGLE_REDIRECT_URI
} = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const cors = require('cors');
app.use(cors());  //모든 cors 오픈

let db;
MongoClient.connect('mongodb+srv://tkdals0920:000920@cluster0.ehjfw8p.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true }, (err, client) => {
  if (err) return console.log(err)
  db = client.db('summit');

  app.listen(8080, () => {
    console.log('listening on 8080')
  });
});

app.post("/login", async (req, res) => {
  const authorization_code = req.body.data.in1;
  google_login(authorization_code);

  if (req.body.data.p_nm === "google_login") {
    res.send({
      in1: "성공"
    })
  }
});

/**
로그인 함수
*/

const google_login = async (authorization_code) => {
  const GOOGLE_AUTH_URL =
    `grant_type=${GOOGLE_GRANT_TYPE}&` +
    `code=${authorization_code}&` +
    `client_id=${GOOGLE_CLIENT_ID}&` +
    `client_secret=${GOOGLE_CLIENT_SECRET}&` +
    `redirect_uri=${GOOGLE_REDIRECT_URI}&`;

  const hi = await axios.post("https://www.googleapis.com/oauth2/v4/token", GOOGLE_AUTH_URL, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  });

  const access_token = hi.data.access_token;
  const refresh_token = hi.data.refresh_token;
  const expires_in = hi.data.expires_in;
  send_google_email("tkdals0920@naver.com", access_token, refresh_token, expires_in);
}


