import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailerService {
  private readonly mailer: Resend;

  constructor() {
    this.mailer = new Resend(process.env.RESEND_API_KEY);
  }

  async sendCreatedAccountEmail({
    recipient,
    firstname,
  }: {
    recipient: string;
    firstname: string;
  }) {
    try {
      const data = await this.mailer.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: [recipient],
        subject: 'Bienvenue sur Sylnavy Project Nest.js',
        html: `Bonjour ${firstname} et bienvenue sur <strong>Sylnavy Project Nest.js</strong>, nous sommes ravis de vous accueillir.`,
      });
      console.log({ data });
    } catch (error) {
      return console.error({ error });
    }
  }
  async sendRequestPasswordEmail({
    recipient,
    firstname,
    code,
  }: {
    recipient: string;
    firstname: string;
    code: string;
  }) {
    try {
      const data = await this.mailer.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: [recipient],
        subject: 'Demande de réinitialisation du Mot de passe',
        html: `Bonjour ${firstname} voici votre code d'initialisation du mot de passe : ${code}`,
      });
      console.log({ data });
    } catch (error) {
      return console.error({ error });
    }
  }
}

