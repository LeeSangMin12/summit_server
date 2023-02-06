const router = require("express").Router();

const is_login = (req, res, next) => {
	if (req.user) {
		next();
	} else {
		res.send("로그인 안하셨습니다.");
	}
};

router.use(is_login);  //여기있는 모든 url에 적용할 미들웨어
router.use("/shirts", is_login)

router.get("/shirts", (req, res) => {
	res.send("셔츠 파는 페이지입니다.");
});

router.get("/pants", (req, res) => {
	res.send("바지 파는 페이지입니다.");
});

module.exports = router;