'use strict';

let nodemailer = require('nodemailer');
let EmailTemplates = require('swig-email-templates');
let config = require("config");

let mail = nodemailer.createTransport(config.get("email"));

let templates = new EmailTemplates({
    root: 'email/templates',
    text: false,
    swig: { cache: false }
});
let sendEmail = function(to, templateName, context) {
    return new Promise((resolve, reject) => {
        templates.render(templateName, context, function(err, html, text, subject) {
            if (err) console.log(err);

            mail.sendMail({
                sender: config.get("email.auth.user"),
                to: to,
                subject: subject,
                html: html
            }, function (err, res) {
                if(err) {
                    reject(err);
                    console.log(err);
                }else {
                    resolve(res);
                    console.log('html: ' + html);
                    console.log('subject: ' + subject);
                }
            });
        });
    });
};

module.exports = {
    sendEmail: sendEmail
};
