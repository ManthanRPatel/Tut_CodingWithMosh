const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const CONFIG = require('../../config/config')


const sendEmail = async (email, subject, payload, template) => {
    try {
        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            host: CONFIG.EMAIL_HOST,
            auth: {
                user: CONFIG.USER_EMAIL,
                pass: CONFIG.USER_PASSWORD, // naturally, replace both with your real credentials or an application-specific password
            },
        });
        // port: 465,

        const source = fs.readFileSync(path.join(__dirname, template), "utf8");
        // console.log("source ", source)
        const compiledTemplate = handlebars.compile(source);
        // console.log("compiledTemplate ", compiledTemplate)
        // console.log("compiledTemplate(payload) ", compiledTemplate(payload))
        const options = () => {
            return {
                from: CONFIG.USER_EMAIL,
                to: email,
                subject: subject,
                html: compiledTemplate(payload),
            };
        };
        console.log("email ", email," CONFIG.USER_EMAIL" , CONFIG.USER_EMAIL)

        // console.log("options ", options)

        // Send email
        transporter.sendMail(options(), (error, info) => {
            if (error) {
                console.log("error 1111",error)
                return({ status: false, message: error.message });
            } else {
                return({ status: true, message: 'Email sent successfully!!!' });
            }
        });
    } catch (error) {
        console.log("error ", error)
        return({ status: false, message: error.message });
    }
};


module.exports = sendEmail;