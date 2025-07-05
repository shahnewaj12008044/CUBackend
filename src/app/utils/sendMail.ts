

import AppError from '../errors/AppError';
import nodemailer from 'nodemailer';
import httpStatus from 'http-status-codes';
import config from '../config';

import { google } from 'googleapis';

const oAuth2Client = new google.auth.OAuth2(
  config.google_client_id,
  config.google_client_secret,
  config.google_redirect_uri, // should be the same used in playground
);

oAuth2Client.setCredentials({
  refresh_token: config.google_refresh_token,
});

export const sendMail = async (
  to: string,
  subject: string,
  text: string,
  html: string,
) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: config.senders_email,
        clientId: config.google_client_id,
        clientSecret: config.google_client_secret,
        refreshToken: config.google_refresh_token,
        accessToken: accessToken.token as string, // or accessToken if you use .toString()
      },
    });

    await transporter.sendMail({
      from: config.senders_email,
      to,
      subject,
      text,
      html,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to send email', error);
  }
};
