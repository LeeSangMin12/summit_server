const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();  //env 파일 가져오기

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  NAVER_CLINET_ID,
  NAVER_CLINET_SECRET
} = process.env;

/**
 * node_mailer를 이용해서 gmail 보내기
 */
const send_google_email = async (receiverEmail, access_token, refresh_token, expires_in) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: "isangmin516@gmail.com",
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      refreshToken: refresh_token,
      accessToken: access_token,
      expires: expires_in,
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

module.exports = send_google_email;