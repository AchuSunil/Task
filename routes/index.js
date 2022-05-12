const express = require("express");
const router = express.Router();

const {
    home,
    loginGet,
    loginPost,
    emailMsg,
    verifyEmail,
    signUp,
    register,
    logOut,
    myProfile,
    updateMyProfileGet,
    updateMyProfilePost,
    passChangeGet,
    passChangePost,
} = require("../controllers/userControllers");
const { verifyLogin } = require("../middlewares/verifyLogin");

/*------------ GET users-home page.-------------------------------------- */
router.get("/", verifyLogin, home);

/*------------ login- page----------------------------------------------- */
router.route("/login").get(loginGet).post(loginPost);

/*------------ email verification sent message page---------------------- */
router.get("/emailMsg", verifyLogin, emailMsg);

/*------------ email verification sent message page---------------------- */
router.get("/verify-email", verifyEmail);

/*-----------for get signup page------------------------------------------*/
router.get("/signup", signUp);

/*-----------for post register user---------------------------------------*/
router.post("/register",register);

/*-----------user logout--------------------------------------------------*/
router.get("/logout", logOut);

/*-----------user profile-------------------------------------------------*/
router.get("/myprofile",verifyLogin, myProfile);

/*-----------user profile update------------------------------------------*/
router.route("/updatemyprofile").get(verifyLogin, updateMyProfileGet).post(verifyLogin, updateMyProfilePost);

/*------- user password change--------------------------------------------*/
router.route("/passwordChange").get(verifyLogin,passChangeGet).post(verifyLogin, passChangePost);

module.exports = router;
