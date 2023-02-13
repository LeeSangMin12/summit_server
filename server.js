const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const axios = require('axios');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const send_google_email = require("./js/libs/node_mailer.js");

dotenv.config();  //env 파일 가져오기

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  NAVER_CLINET_ID,
  NAVER_CLINET_SECRET,
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

  if (req.body.data.p_nm === "google_login") {
    google_login(authorization_code);
    res.send({
      in1: "성공"
    });
  } else if (req.body.data.p_nm === "naver_login") {
    naver_login(authorization_code);
    res.send({
      in1: "성공"
    });
  }
  
});

/**
 * 구글 로그인 
 */
const google_login = async (authorization_code) => {
  const GOOGLE_AUTH_URL =
    `grant_type=authorization_code&` +
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

/**
 * 네이버 로그인
 */
const naver_login = async (authorization_code) => {
  const NAVER_AUTH_URL = 
  `grant_type=authorization_code&` +
  `code=${authorization_code}&` +
  `client_id=${NAVER_CLINET_ID}&` +
  `client_secret=${NAVER_CLINET_SECRET}&`;

  const hi = await axios.post("https://auth.worksmobile.com/oauth2/v2.0/token", NAVER_AUTH_URL, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  })
  console.log(hi);

  // const NAVER_AUTH_URL = 
  // `grant_type=authorization_code&` +
  // `code=${authorization_code}&` +
  // `client_id=${NAVER_CLINET_ID}&` +
  // `client_secret=${NAVER_CLINET_SECRET}&`;

  // const hi = await axios.post("https://nid.naver.com/oauth2.0/token", NAVER_AUTH_URL, {
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded'
  //   },
  // });

  // const access_token = hi.data.access_token;
  // const refresh_token = hi.data.refresh_token;
  // const expires_in = hi.data.expires_in;
  // send_naver_email("isangmin516@gmail.com", access_token, refresh_token, expires_in);
}; 


/**
 * node_mailer를 이용해서 naver email 보내기
 */
const send_naver_email = async (receiverEmail, access_token, refresh_token, expires_in) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.naver.com",
    port: 465,
    auth: {
      user: "jowelll",
      pass: "Dabiti0311!e",
    },
  });

  const message = {
    from: "jowelll@naver.com",
    to: receiverEmail,
    subject: 'Nodemailer X Gmail OAuth 2.0 테스트',
    text: "안녕?"
  };

  try {
    await transporter.sendMail(message);
    console.log('메일을 성공적으로 발송했습니다.');
  } catch (e) {
    console.log(e);
  }
};