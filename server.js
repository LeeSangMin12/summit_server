// const express = require("express");
// const app = express();

// const http = require("http").createServer(app);
// const {Server} = require("socket.io");
// const io = new Server(http);

// const mongo_client = require("mongodb").MongoClient;
// const methodOverride = require("method-override");
// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// const session = require("express-session");
// require("dotenv").config();

// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.set("view engine", "ejs");

// app.use("/public", express.static("public"));
// app.use(
//   session({ secret: "비밀코드", resave: true, saveUninitialized: false })
// );
// app.use(passport.initialize());
// app.use(passport.session());

// app.use("/shop", require("./routes/shop.js"));
// app.use("/board/sub", require("./routes/board.js"));

// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: "id",
//       passwordField: "pw",
//       session: true,
//       passReqToCallback: false,
//     },
//     function (입력한아이디, 입력한비번, done) {
//       // console.log(입력한아이디, 입력한비번);
//       db.collection("login").findOne(
//         { id: 입력한아이디 },
//         function (에러, 결과) {
//           if (에러) return done(에러);

//           if (!결과)
//             return done(null, false, { message: "존재하지않는 아이디요" });
//           //애초에 DB에 pw를 저장할 때 암호화해서 저장하는 것이 좋으며
//           //사용자가 입력한 비번을 암호화해준 뒤에 이게 결과.pw와 같은지 비교하는게 조금 더 보안에 신경쓴 방법
//           if (입력한비번 == 결과.pw) {
//             return done(null, 결과);
//           } else {
//             return done(null, false, { message: "비번틀렸어요" });
//           }
//         }
//       );
//     }
//   )
// );

// //id를 이용해서 세션을 저장시키는 코드(로그인 성공시 발동)
// //세션 데이터를 만들고 세션의 id정보를 쿠키로 보냄
// passport.serializeUser(function (user, done) {
//   done(null, user.id);
// });

// //이 세션 데이터를 가진 사람을 db에서 찾아주세요(마이페이지 접속시 발동)
// passport.deserializeUser(function (아이디, done) {
//   db.collection("login").findOne({ id: 아이디 }, function (에러, 결과) {
//     done(null, 결과);
//     // 여기서 결과엔 { id : 입력한 id, pw : 입력한 pw, 이름 : 이름 } 등 내가 넣은 정보들이 저장
//     // 결과에 담긴 데이터들은 app.get('/mypage')에서 요청.user (req.user) 에 담겨있음
//   });
// });

// let db;
// mongo_client.connect(process.env.DB_URL, (err, client) => {
//   db = client.db("todoapp");

//   http.listen(process.env.PORT, () => {
//     console.log(`listening on ${process.env.PORT}`);
//   });
// });

// app.get("/socket", (req, res) => {
//   res.render("socket.ejs");
// });

// io.on("connection", function(socket) {
//   console.log("유저접속됨");

//   socket.on("room1-send", function(data){
//     io.to("room1").emit("broadcast", data);
//   })

//   socket.on("joinroom", function(data){
//     socket.join("room1");
//   })

//   socket.on("user-send", function(data){
//     io.emit("broadcast", data);
//   });
// });

// app.get("/login", (req, res) => {
//   res.render("login.ejs");
// });

// app.get("/", (req, res) => {
//   res.render("index.ejs");
// });

// app.get("/write", (req, res) => {
//   res.render("write.ejs");
// });

// app.get("/list", (req, res) => {
//   db.collection("post")
//     .find()
//     .toArray((err, result) => {
//       res.render("list.ejs", { posts: result });
//     });
// });

// const is_login = (req, res, next) => {
//   if (req.user) {
//     next();
//   } else {
//     res.send("로그인 안하셨습니다.");
//   }
// };

// app.get("/mypage", is_login, (req, res) => {
//   res.render("mypage.ejs", { 사용자: req.user });
// });

// app.get("/search", (req, res) => {
//   db.collection("post")
//     .aggregate()
//     .toArray((err, result) => {
//       const search_criterion = [
//         {
//           $search: {
//             index: "titleSearch",
//             text: {
//               query: req.query.value,
//               path: "제목", //제목날짜 둘다 찾고 싶으면 ["제목", "날짜"]
//             },
//           },
//         },
//         //검색조건 넣는곳.
//         //숫자 1은 가져오지 않음
//         //score은 많이 검색된 순위
//         { $project: { 제목: 1, _id: 0, score: { $meta: "searchScore" } } },
//       ];
//       console.log(result);

//       res.render("search.ejs", { posts: result });
//     });
// });

// app.get("/detail/:id", (req, res) => {
//   db.collection("post").findOne(
//     { _id: parseInt(req.params.id) },
//     (err, result) => {
//       res.render("detail.ejs", { data: result });
//     }
//   );
// });

// app.get("/edit/:id", (req, res) => {
//   db.collection("post").findOne(
//     { _id: parseInt(req.params.id) },
//     (err, result) => {
//       res.render("edit.ejs", { post: result });
//     }
//   );
// });

// let multer = require("multer");
// let storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./public/image"); //저장할 이미지 경로
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname); //저장팔 파일 이름 - 기존명이랑 동일하게 설정
//   },
// });
// app.get("/upload", (req, res) => {
//   res.render("upload.ejs");
// });
// let upload = multer({ storage: storage });

// app.get("/image/:image_name", (req, res) => {
//   //__dirname = 현재 파일 경로
//   res.sendFile(__dirname + "/public/image/" + req.params.image_name);
// });

// app.post("/upload", upload.single("profile"), (req, res) => {
//   res.send("업로드완료");
// });

// app.get("/chat", is_login, (req, res) => {
//   db.collection("chatroom")
//     .find({ member: req.user._id })
//     .toArray()
//     .then((결과) => {
//       res.render("chat.ejs", { data: 결과 });
//     });
// });

// app.post("/message", is_login, (req, res) => {
//   var 저장할거 = {
//     parent: req.body.parent,
//     content: req.body.content,
//     userid: req.user._id,
//     date: new Date(),
//   };

//   db.collection("message")
//     .insertOne(저장할거)
//     .then(() => {
//       console.log("성공");
//       res.send("db저장성공");
//     });
// });

// app.put("/edit", (req, res) => {
//   db.collection("post").updateOne(
//     { _id: parseInt(req.body.id) },
//     { $set: { 제목: req.body.title, 날짜: req.body.date } },
//     (err, result) => {
//       res.redirect("/list");
//     }
//   );
// });

// app.post(
//   "/login",
//   passport.authenticate("local", {
//     failureRedirect: "/fail",
//   }),
//   (req, res) => {
//     res.redirect("/");
//   }
// );

// app.post("/register", (req, res) => {
//   db.collection("login").insertOne(
//     { id: req.body.id, pw: req.body.pw },
//     (err, result) => {
//       res.redirect("/");
//     }
//   );
// });

// app.post("/add", (req, res) => {
//   res.send("전송완료");

//   db.collection("counter").findOne({ name: "게시물갯수" }, (err, result) => {
//     const total_post_num = result.total_post;

//     const save_writing_info = {
//       _id: total_post_num + 1,
//       작성자: req.user._id,
//       제목: req.body.title,
//       날짜: req.body.date,
//     };

//     db.collection("post").insertOne(save_writing_info, (err, res) => {
//       db.collection("counter").updateOne(
//         { name: "게시물갯수" },
//         { $inc: { total_post: 1 } },
//         (err, result) => {
//           if (err) {
//             return console.log(err);
//           }
//         }
//       );
//     });
//   });
// });

// app.delete("/delete", (req, res) => {
//   req.body._id = parseInt(req.body._id);

//   const delete_data = { _id: req.body._id, 작성자: req.user._id };
//   db.collection("post").deleteOne(delete_data, (err, result) => {
//     console.log("삭제완료");
//     res.status(200).send({ message: "성공했습니다" });
//   });
// });

// const { ObjectId } = require("mongodb");
// app.post("/chatroom", is_login, (req, res) => {
//   var 저장할거 = {
//     title: "무슨무슨채팅방",
//     member: [ObjectId(req.body.당한사람id), req.user._id],
//     date: new Date(),
//   };
//   db.collection("chatroom")
//     .insertOne(저장할거)
//     .then((result) => {
//       res.send("성공");
//     });
// });

// app.get('/message/:id', is_login, function(요청, 응답){

//   응답.writeHead(200, {
//     "Connection": "keep-alive",
//     "Content-Type": "text/event-stream",
//     "Cache-Control": "no-cache",
//   });

//   db.collection('message').find({ parent: 요청.params.id }).toArray()
//   .then((결과)=>{
//     console.log(결과);
//     응답.write('event: test\n');
//     응답.write(`data: ${JSON.stringify(결과)}\n\n`);
//   });


//   const 찾을문서 = [
//     { $match: { 'fullDocument.parent': 요청.params.id } }
//   ];

//   const changeStream = db.collection('message').watch(찾을문서);
//   changeStream.on('change', result => {
//     응답.write("event: test\n");
// 		응답.write("data: " + JSON.stringify([result.fullDocument]) + "\n\n");
//   });
// });

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());  //모든 cors 오픈

app.listen(8080, function () {
  console.log('listening on 8080');
})

app.get('/hi', function (req, res) {
  // console.log(req);
  // res.send("펫용품 사시오");
}) 

app.post("/hi", (req, res) => {
  console.log(req.data);
  res.send("성공");
});