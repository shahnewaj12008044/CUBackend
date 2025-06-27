// import AppError from "../errors/AppError";
// import nodemailer from "nodemailer";
// import httpStatus from "http-status-codes";
// import config from "../config";


// export const sendMail = async (to: string, subject: string, text: string) => {
//   try {
//     const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: config.NODE_ENV === "production", // true for 465, false for other ports
//   auth: {
//     type: "OAuth2",
//     user: config.senders_email,
//     accessToken: config.google_access_token ,
//      clientId: config.google_client_id,
//     clientSecret: config.google_client_secret,
//     refreshToken: config.google_refresh_token,
//   },
// });

//  await transporter.sendMail({
//     from: config.senders_email,
//     to: to,
//     subject: subject,
//     text: text,
//     html: `<b>${text}</b>`,
//   });
   
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error : any) {
//   console.log("Error sending email:", error);
//     throw new AppError(httpStatus.BAD_REQUEST,'Failed to send email',error);
//   }
// }



import AppError from "../errors/AppError";
import nodemailer from "nodemailer";
import httpStatus from "http-status-codes";
import config from "../config";

export const sendMail = async (to: string, subject: string, text: string, html: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: config.senders_email,
        clientId: config.google_client_id,
        clientSecret: config.google_client_secret,
        refreshToken: config.google_refresh_token,
        accessToken: config.google_access_token,
      },
    });

    await transporter.sendMail({
      from: config.senders_email,
      to,
      subject,
      text,
      html
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to send email", error);
  }
};

