import nodemailer from "nodemailer";
import envConfig from "../config/env.js";

const transporter = nodemailer.createTransport({
    service:"Gmail",
    auth:{
        type:"OAuth2",
        user:envConfig.GOOGLE_USER,
        clientId:envConfig.GOOGLE_CLIENT_ID,
        clientSecret:envConfig.GOOGLE_CLIENT_SECRET,
        refreshToken:envConfig.GOOGLE_REFRESH_TOKEN
    }

});



transporter.verify((error,success)=>{
    if(error){
        console.log("error in connecting email server",error);

    }else{
        console.log("email server is ready to send message")
    }
});

export const sendEmail = async(to,subject,text,html)=>{
    try {
        const info = await transporter.sendMail({
            from:`${envConfig.GOOGLE_USER}`,
            to,
            subject,
            text,
            html
        });
        console.log("Message sent: %s",info.messageId);
        console.log("Preview URL:%s",nodemailer.getTestMessageUrl(info))
    } catch (error) {
        console.error("Error sending email:",error)
    }
}