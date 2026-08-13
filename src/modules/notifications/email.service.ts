import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async sendCredentials(user: { id: string; name: string; email: string }, password: string, messName: string) {
    const subject = `Your ${messName} account credentials`;
    const text = `Hello ${user.name}, your account has been approved for ${messName}. Email: ${user.email}. Temporary password: ${password}. Please change it after signing in.`;
    const html = `<p>Hello ${user.name},</p><p>Your account has been approved for <strong>${messName}</strong>.</p><p>Email: <strong>${user.email}</strong><br/>Temporary password: <strong>${password}</strong></p><p>Please change your password after signing in.</p>`;

    const host = this.config.get<string>("SMTP_HOST");
    if (!host) {
      this.logger.warn(`SMTP is not configured; credential email for ${user.email} was not sent.`);
      return { sent: false };
    }

    const transporter = nodemailer.createTransport({
      host,
      port: Number(this.config.get("SMTP_PORT", 587)),
      secure: this.config.get("SMTP_SECURE") === "true",
      auth: this.config.get("SMTP_USER")
        ? { user: this.config.get("SMTP_USER"), pass: this.config.get("SMTP_PASS") }
        : undefined,
    });
    await transporter.sendMail({ from: this.config.get("SMTP_FROM") || this.config.get("SMTP_USER"), to: user.email, subject, text, html });
    await this.prisma.emailLog.create({ data: { userId: user.id, email: user.email, subject, message: text, html } });
    return { sent: true };
  }
}
