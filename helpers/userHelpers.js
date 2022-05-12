const db = require("../config/connection");
const collection = require("../config/collection");
const bcrypt = require("bcrypt");
const ObjectId = require("mongodb").ObjectId;
const crypto = require("crypto");

module.exports = {
    doSignup: async (userDetails) => {
        userDetails.password = await bcrypt.hash(userDetails.password, 10);
        return new Promise((resolve, reject) => {
            let user = db.get().collection(collection.user).find({ email: userDetails.email });
            if (user) {
                resolve({ status: false });
            } else {
                const emailSend = false;
                userDetails.emailSend = emailSend;
                db.get()
                    .collection(collection.user)
                    .insertOne(userDetails)
                    .then(() => {
                        resolve({ status: true });
                        console.log("Inserted Successfully");
                    });
            }
        });
    },

    doLogin: (loginDetails) => {
        const email = loginDetails.email;
        let response = {};

        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.user).findOne({ email: email });

            if (user) {
                const token = crypto.randomBytes(64).toString("hex");
                const isVerified = false;
               db.get()
                    .collection(collection.user)
                    .updateOne(
                        { _id: user._id },
                        { $set: { token: token, isVerified: isVerified} },
                        { upsert: true }
                    );

                bcrypt.compare(loginDetails.password, user.password).then((status) => {
                    if (status) {
                        response.user = user;
                        response.status = true;
                        resolve(response);
                    }
                });
            } else {
                console.log("login failed");
                resolve({ status: false });
            }
        });
    },

    getUserInfo: (userId) => {
        return new Promise(async (resolve, reject) => {
            let userInfo = await db
                .get()
                .collection(collection.user)
                .findOne({ _id: ObjectId(userId) });
            resolve(userInfo);
        });
    },

    saveInfo: (info, userId) => {
        return new Promise((resolve, reject) => {
            if (info.gender) {
                db.get()
                    .collection(collection.user)
                    .updateOne(
                        { _id: ObjectId(userId) },
                        {
                            $set: {
                                firstName: info.firstName,
                                lastName: info.lastName,
                                gender: info.gender,
                                phoneNumber: info.phoneNumber,
                                alternativeNumber: info.alternativeNumber,
                            },
                        },
                        { upsert: true }
                    )
                    .then(() => {
                        resolve();
                    });
            } else {
                db.get()
                    .collection(collection.user)
                    .updateOne(
                        { _id: ObjectId(userId) },
                        {
                            $set: {
                                firstName: info.firstName,
                                lastName: info.lastName,
                                phoneNumber: info.phoneNumber,
                                alternativeNumber: info.alternativeNumber,
                            },
                        },
                        { upsert: true }
                    )
                    .then(() => {
                        resolve();
                    });
            }
        });
    },

    getTokenAndEmailSend: (userId) => {
        return new Promise(async (resolve, reject) => {
            await db
                .get()
                .collection(collection.user)
                .findOne({ _id: ObjectId(userId) })
                .then((response) => {
                    let tokenAndEmailSend = {};
                    tokenAndEmailSend.token = response.token;
                    tokenAndEmailSend.emailSend = response.emailSend;
                    resolve(tokenAndEmailSend);
                });
        });
    },

    verifyEmail: (userId, token) => {
        return new Promise(async (resolve, reject) => {
            let user = await db
                .get()
                .collection(collection.user)
                .findOne({ _id: ObjectId(userId) });

            if (user) {
                if (user.token === token) {
                    db.get()
                        .collection(collection.user)
                        .updateOne(
                            { _id: ObjectId(userId) },
                            {
                                $set: {
                                    token: null,
                                    isVerified: true,
                                },
                            }
                        )
                        .then(() => {
                            resolve({ status: true });
                        });
                }
            } else {
                resolve({ status: false });
            }
        });
    },

    emailSend: (userId) => {
        return new Promise(async (resolve, reject) => {
            let user = await db
                .get()
                .collection(collection.user)
                .findOne({ _id: ObjectId(userId) });
            if (user) {
                const emailSend = true;
                db.get()
                    .collection(collection.user)
                    .updateOne({ _id: ObjectId(userId) }, { $set: { emailSend: emailSend } }, { upsert: true })
                    .then(() => {
                        resolve();
                    });
            }
        });
    },

    emailSendStatusChange:(userId)=>{
        return new Promise(async (resolve, reject) => {
            let user = await db
                .get()
                .collection(collection.user)
                .findOne({ _id: ObjectId(userId) });
            if (user) {
                db.get()
                    .collection(collection.user)
                    .updateOne({ _id: ObjectId(userId) }, { $set: { emailSend: false } }, { upsert: true })
                    .then(() => {
                        resolve();
                    });
            }
        });
    },

    changePassword:({curPassword,newPassword},userId)=>{
        return new Promise((resolve, reject) => {
            db.get()
                .collection(collection.user)
                .findOne({ _id: ObjectId(userId) })
                .then((user) => {
                    bcrypt.compare(curPassword, user.password).then(async (status) => {
                        if (status) {
                            newPassword = await bcrypt.hash(newPassword, 10);

                            await db
                                .get()
                                .collection(collection.user)
                                .updateOne(
                                    { _id: ObjectId(userId) },
                                    {
                                        $set: {
                                            password: newPassword,
                                        },
                                    }
                                );

                            resolve({ status: true });
                        } else {
                            resolve({ errOccur: true });
                        }
                    });
                });
        });
    },
    
};
