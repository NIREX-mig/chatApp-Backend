import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS
    }
});

const sendEmail = async (email, username) => {
    try {

        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: "Welcome to ChatApp - Let's Start Chatting!",
            html: `<h1>Welcome to ChatApp - Let's Start Chatting!</h1>
            <h4>Dear ${username},</h4>

            <p>Welcome to ChatApp! We're delighted to have you join our vibrant community of chatterboxes. Get ready to dive into lively conversations, connect with friends old and new, and explore a world of endless possibilities.</p>
            
            <p>At ChatApp, we're all about bringing people together. Whether you're here to catch up with friends, collaborate with colleagues, or meet like-minded individuals, our platform is designed to make communication seamless and fun.</p>`
        };
        const info = await transporter.sendMail(mailOptions)

        // console.log("Message sent: %s", info.messageId);

    } catch (error) {
        console.log("Some Error occured during sending Email!")
        console.log(error);
    }

}

const sendForgotPasswordEmail = async (email, username, token) => {
    try {

        const link = `http://localhost:3000/forgot?token=${token}`

        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: "Forgot Password",
            html: `
            <h2>HI ${username},</h2>
            <br>
            <p>There was a request to change your password!</p>
            <br>
            <p>If you did not make this request then please ignore this email.</p>
            <br>
            <p>Otherwise, please click this button to change your password:</p>

             <a href=${link} style="background:#2112bb ;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px; margin:0 auto;">Reset Password</a>
            `
        };


        const info = await transporter.sendMail(mailOptions)

        // console.log("Message sent: %s", info.messageId);

    } catch (error) {
        console.log("Some Error occured during sending Email!")
        console.log(error);
    }
}

export { sendEmail, sendForgotPasswordEmail };