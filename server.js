const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const cors = require('cors');
app.use(cors());  //모든 cors 오픈

app.listen(8080, function () {
  console.log('listening on 8080');
})

app.post("/login", (req, res) => {
  const code = req.data.in1;
  const CLIENT_ID = "110582210870-t1umgjfntk3p2v27ovk2ddhhifec0kid.apps.googleusercontent.com";
  const CLIENT_SECRET = "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";
  const REDIRECT_URL = "http://localhost:5173/app/home";
  if(req.body.data.p_nm === "google_login"){
    async function hi() {
      const token_api = await axios.post(`https://oauth2.googleapis.com/token?code=${code}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URL}&grant_type=authorization_code`);
      console.log("token_api", token_api);
      // const accessToken = token_api.data.access_token;
      // console.log(accessToken);
    } 
    hi();

    res.send({
      in1: "성공",
    });
  }
})