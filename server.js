const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const axios = require('axios');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();  //env 파일 가져오기

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  NAVER_CLIENT_ID,
  NAVER_CLIENT_SECRET,
} = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const cors = require('cors');
app.use(cors());  //모든 cors 오픈

let db;
MongoClient.connect('mongodb+srv://tkdals0920:000920@cluster0.ehjfw8p.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true }, (err, client) => {
  if (err) return console.log(err);
  db = client.db('summit');

  app.listen(8080, () => {
    console.log('listening on 8080')
  });
});

app.post("/login", async (req, res) => {
  const authorization_code = req.body.data.in1;

  if (req.body.data.p_nm === "google_login") {
    const token_info = await get_token(authorization_code);
    const email_address = await get_email(token_info);

    db.collection("login").findOne({ email: email_address }, (err, result) => {
      if(result !== null){
        res.send("ok");
      } else {
        res.send("");
      }
    });

  } else if (req.body.data.p_nm === "naver_login") {
    naver_login(authorization_code);
    res.send({
      in1: "성공"
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


/**
 * 네이버 로그인
 */
const naver_login = async (authorization_code) => {
  const NAVER_AUTH_URL =
    `grant_type=authorization_code&` +
    `code=${authorization_code}&` +
    `client_id=${NAVER_CLIENT_ID}&` +
    `client_secret=${NAVER_CLIENT_SECRET}&`;

  const hi = await axios.post("https://nid.naver.com/oauth2.0/token", NAVER_AUTH_URL, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  })

  const access_token = hi.data.access_token;
  const refresh_token = hi.data.refresh_token;
  const expires_in = hi.data.expires_in;
  send_naver_email("isangmin516@gmail.com", access_token, refresh_token, expires_in);
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
