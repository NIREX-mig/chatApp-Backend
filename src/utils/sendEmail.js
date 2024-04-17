import nodemailer from "nodemailer";
import ApiError from "../utils/apiError.js"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS
    }
});

const sendEmail = async (username) => {
    try {

        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: "akay93796@gmail.com",
            subject: "Welcome to ChatApp - Let's Start Chatting!",
            html: `<h1>Welcome to ChatApp - Let's Start Chatting!</h1>
            <h4>Dear ${username},</h4>

            <p>Welcome to ChatApp! We're delighted to have you join our vibrant community of chatterboxes. Get ready to dive into lively conversations, connect with friends old and new, and explore a world of endless possibilities.</p>
            
            <p>At ChatApp, we're all about bringing people together. Whether you're here to catch up with friends, collaborate with colleagues, or meet like-minded individuals, our platform is designed to make communication seamless and fun.</p>`
        };


        const info = await transporter.sendMail(mailOptions)
        
        console.log("Message sent: %s", info.messageId);

    } catch (error) {
        console.log("Some Error occured during sending Email!")
        console.log(error);
    }

}

export { sendEmail };