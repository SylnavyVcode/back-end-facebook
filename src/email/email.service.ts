import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
// import * as dotenv from 'dotenv';

// dotenv.config();

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.EMAIL_HOST_PASSWORD,
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: '"NestJS App" <no-reply@nestjs.com>',
      to,
      subject,
      text,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
