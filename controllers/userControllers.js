const userHelpers = require("../helpers/userHelpers");
const nodemailer = require("nodemailer");

exports.home = (req, res) => {
    res.render("index");
};

exports.loginGet = (req, res) => {
    if (req.session.user) {
        res.redirect("/");
    } else {
        if (req.session.loginErr) {
            req.session.loginErr = false;
            let errMsg = "*Email address not Exist";
            res.render("userLogin", { errMsg });
        }
        res.render("userLogin");
    }
};

exports.loginPost = (req, res) => {
    userHelpers.doLogin(req.body).then(async (response) => {
        if (response.status) {
            req.session.user = response.user;
            let { token, emailSend } = await userHelpers.getTokenAndEmailSend(req.session.user._id);

            if (emailSend !== true) {
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: "testingnoreply7@gmail.com",
                        pass: process.env.password,
                    },
                    tls: {
                        rejectUnauthorized: false,
                    },
                });

                const mailOptions = {
                    from: ' "Verify Your Email" <testingnoreply7@gmail.com>',
                    to: response.user.email,
                    subject: "verify your email",
                    html: `<h2> ${response.user.username} Thanks for registering on our site </h2>
                        <h4> Please verify your mail to continue...</h4>
                        <a href="http://${req.headers.host}/verify-email?token=${token}">Verify Your Token</a>
                        `,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        console.log("email verification error");
                    } else {
                        console.log("verification email sent to your gmail account");
                    }
                });

                userHelpers.emailSend(req.session.user._id).then(() => {
                    res.redirect("/emailMsg");
                });
            } else {
                res.redirect("/emailMsg");
            }
        } else {
            req.session.loginErr = true;
            res.redirect("/login");
        }
    });
};

exports.emailMsg = (req, res) => {
    res.render("emailMsg");
};

exports.verifyEmail = async (req, res) => {
    if (req.session.user) {
        const token = req.query.token;

        await userHelpers.verifyEmail(req.session.user._id, token).then((response) => {
            if (response.status) {
                res.redirect("/");
            } else {
                res.redirect("/login");
                console.log("Email is not verified");
            }
        });
    } else {
        res.redirect("/login");
        console.log("req.session.user not found");
    }
};

exports.signUp = (req, res) => {
    if (req.session.user) {
        res.redirect("/");
    } else {
        if (req.session.err) {
            req.session.err = false;
            let errMsg = "*User Already Exist";
            res.render("userSignup", { errMsg });
        } else {
            res.render("userSignup");
        }
    }
};

exports.register = (req, res) => {
    userHelpers.doSignup(req.body).then((response) => {
        if (response.status) {
            res.redirect("/login");
        } else {
            req.session.err = true;
            res.redirect("/signup");
        }
    });
};

exports.logOut = (req, res) => {
    userHelpers.emailSendStatusChange(req.session.user._id).then(() => {
        req.session.user = null;
        res.redirect("/");
    });
};
exports.myProfile = (req, res) => {
  
        userHelpers.getUserInfo(req.session.user._id).then((userInfo) => {
            res.render("myprofile", { userInfo });
        });
  
};

exports.updateMyProfileGet = (req, res) => {
    userHelpers.getUserInfo(req.session.user._id).then((userInfo) => {
        res.render("updatemyprofile", { userInfo });
    });
};
exports.updateMyProfilePost = (req, res) => {
    userHelpers.saveInfo(req.body, req.session.user._id).then(() => {
        res.redirect("/myprofile");
    });
};
exports.passChangeGet = (req, res) => {
    
        if (req.session.passErr) {
            req.session.passErr = false;
            let passErr = "*Entered Incorrect Password";

            res.render("passwordChange", { passErr });
        } else {
            res.render("passwordChange");
        }
    
};

exports.passChangePost = (req, res) => {
    
        userHelpers.changePassword(req.body, req.session.user._id).then((response) => {
            if (response.status) {
                res.redirect("/myprofile");
            } else if (response.errOccur) {
                req.session.passErr = true;
                res.redirect("/passwordChange");
            }
        });
   
};
