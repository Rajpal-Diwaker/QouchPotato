let config = require("./config").config,
    mustache = require('mustache'),
    bodyParser = require('body-parser'),
    nodemailer = require('nodemailer'),
    MD5 = require("md5");
let templates = require('../Utilities/templates');


var querystring = require('querystring');


let encryptData = (stringToCrypt) => {
    return MD5(stringToCrypt);
};

// Define Error Codes
let statusCode = {
    ZERO: 0,
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
    SIX: 6,
    SEVEEN: 7,
    EIGHT: 8,
    NINE: 9,
    TEN: 10,
    OK: 200,
    TWO_ZERO_TWO: 202,
    FOUR_ZERO_FOUR: 404,
    FOUR_ZERO_ZERO: 400,
    FOUR_ZERO_ONE: 401,
    BAD_REQUEST: 404,
    INTERNAL_SERVER_ERROR: 500,
    FIVE_ZERO_ZERO: 500
};

// Define Error Messages
let statusMessage = {
    REGISTRATION_DONE: 'Registration successful.',
    LOGGED_IN: 'You have sucessfully logged in',
    COMPLETE: 'Complete your profile',
    PARAMS_MISSING: 'Mandatory fields missing',
    SERVER_BUSY: 'Failed to connect to server . Please try again later.',
    INCORRECT_PASSWORD: 'Please enter correct old password.',
    PASSWORD_CHANGED: 'Your Password has been changed successfully.',
    LOGOUT: 'You are now signed out.',
    PAGE_NOT_FOUND: 'Page not found', //404
    USER_NOT_FOUND: 'User not found',
    DB_ERROR: 'database related error occured', // data base related error...
    EMAIL_NOT_REGISTERED: 'Email id is not registered',
    GOT_AUDIO_LIST: "Got audio list Successfully",
    // INTERNAL_SERVER_ERROR: 'Internal server error.', //500
    SOMETHING_WENT_WRONG: 'Something went wrong.',
    FETCHED_SUCCESSFULLY: 'Fetched Data Successfully.',
    UPLOAD_SUCCESSFUL: 'Uploaded Image Successfully.',
    USER_ADDED: "User created successfully.",
    STATUS_UPDATED: "Status updated successfully.",
    DEVICE_tOKEN_UPDATE: 'Device token update successfully.',
    LOGIN_SUCCESS: "you are successfully login.",
    USER_EXISTS: "User already exists for provided email.",
    INCORRECT_CREDENTIALS: "Incorrect email or password.",
    INCORRECT_EMAIL: "Please enter correct email.",
    //INCORRECT_EMAIL :"Please enter correct email.",

    EMAIL_SENT: "An email with password reset link has been sent to your registered email id ",
    INVALID_TOKEN: "User Authentication Failed.",
    GET_DATA: "User data fetch successfully.",
    POST: "Post data fetch successfully",
    USERNAME: "This username is already taken!"

};

let getMysqlDate = (rawDate) => {
    let date = new Date(rawDate);
    return date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2);
}

let mailModule = nodemailer.createTransport(config.EMAIL_CONFIG);

let sendEmail = (data) => {
    var mailOptions = {
        from: templates.mailTemplate.from,
        to: data.email,
        subject: templates.mailTemplate.subject,
        html: mustache.render(templates.mailTemplate.text, data)
    }
    mailModule.sendMail(mailOptions);
}

let generateToken = () => {
    return Date.now() + Math.floor(Math.random() * 99999) + 1000;
}

let fileUrl = (imgDir, fileName) => {
    return 'http://localhost:8000/' + imgDir + '/' + fileName;
    //return 'http://52.27.53.102:3000/public/'+imgDir+'/'+fileName;
}

let urlPublic = '/var/www/html/QouchPotato/public/';


module.exports = {
    statusCode: statusCode,
    statusMessage: statusMessage,
    getMysqlDate: getMysqlDate,
    encryptData: encryptData,
    sendEmail: sendEmail,
    generateToken: generateToken,
    fileUrl: fileUrl
}
