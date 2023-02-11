const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const axios = require('axios');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();  //env 파일 가져오기

const {
  GOOGLE_OAUTH_USER,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  GOOGLE_GRANT_TYPE
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



  const send_email = async (receiverEmail, access_token) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: GOOGLE_OAUTH_USER,
        serviceClient: GOOGLE_CLIENT_ID,
        privateKey: '-----${GOOGLE_CLIENT_PWD}-----\n...',
        accessToken: access_token,
        expires: 1484314697598,
      },
    });

    const message = {
      from: "isangmin516@gmail.com",
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
  // send_email("tkdals0920@naver.com", access_token);

  if (req.body.data.p_nm === "google_login") {
    res.send({
      in1: "성공"
    })
  }
});

/**
로그인 함수
*/

const google_login = async(authorization_code) => {
  const GOOGLE_AUTH_URL = 
  `grant_type=${process.env.GOOGLE_GRANT_TYPE}&` +
  `code=${authorization_code}&` +
  `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
  `client_secret=${process.env.GOOGLE_CLIENT_SECRET}&` +
  `redirect_uri=${GOOGLE_REDIRECT_URI}&`;

  const hi = await axios.post("https://www.googleapis.com/oauth2/v4/token", GOOGLE_AUTH_URL, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  });
  console.log(hi)
}
