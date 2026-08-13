// src/modules/notifications/email.service.ts
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

  async sendCredentials(
    user: { id: string; name: string; email: string },
    password: string,
  ) {
    const subject = `Welcome to Mess Management - Your Account Credentials`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #1e293b;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: #f1f5f9;
          }
          .container {
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          .header {
            background: linear-gradient(135deg, #4F46E5, #7C3AED);
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            color: #ffffff;
            font-weight: 700;
          }
          .header .subtitle {
            color: rgba(255, 255, 255, 0.8);
            margin-top: 8px;
            font-size: 16px;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 18px;
            margin-bottom: 20px;
          }
          .greeting strong {
            color: #4F46E5;
          }
          .credentials-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            margin: 24px 0;
          }
          .credentials-box .label {
            font-size: 13px;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }
          .credentials-box .value {
            font-size: 16px;
            font-weight: 500;
            color: #0f172a;
            margin-bottom: 12px;
          }
          .credentials-box .value:last-child {
            margin-bottom: 0;
          }
          .credentials-box .value code {
            background: #e2e8f0;
            padding: 2px 10px;
            border-radius: 4px;
            font-size: 18px;
            font-weight: 600;
            color: #4F46E5;
          }
          .warning-box {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 16px 20px;
            border-radius: 8px;
            margin: 24px 0;
          }
          .warning-box strong {
            color: #92400e;
          }
          .warning-box p {
            margin: 4px 0 0 0;
            color: #78350f;
          }
          .button {
            display: inline-block;
            background: #4F46E5;
            color: #ffffff;
            padding: 14px 36px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: background 0.2s;
          }
          .button:hover {
            background: #4338CA;
          }
          .button-container {
            text-align: center;
            margin: 30px 0 20px 0;
          }
          .divider {
            border: none;
            border-top: 1px solid #e2e8f0;
            margin: 30px 0;
          }
          .footer {
            text-align: center;
            padding: 20px 30px;
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
          }
          .footer p {
            margin: 4px 0;
            color: #94a3b8;
            font-size: 12px;
          }
          .footer .brand {
            color: #64748b;
            font-weight: 600;
          }
          @media (max-width: 480px) {
            .header h1 { font-size: 22px; }
            .content { padding: 24px 16px; }
            .credentials-box { padding: 16px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome!</h1>
            <div class="subtitle">Your account has been created</div>
          </div>
          <div class="content">
            <div class="greeting">
              Hello <strong>${user.name}</strong>,
            </div>
            <p>Your account has been successfully created and approved. You can now access the Mess Management System.</p>
            
            <div class="credentials-box">
              <div class="label">📧 Email</div>
              <div class="value">${user.email}</div>
              <div class="label" style="margin-top: 12px;">🔑 Temporary Password</div>
              <div class="value"><code>${password}</code></div>
            </div>
            
            <div class="warning-box">
              <strong>⚠️ Important:</strong>
              <p>Please change your password after your first login for security reasons.</p>
            </div>
            
            <div class="button-container">
              <a href="${this.config.get("FRONTEND_URL") || "http://localhost:3000"}/login" class="button">
                🔐 Login Now
              </a>
            </div>
            
            <hr class="divider">
            
            <p style="color: #64748b; font-size: 14px; text-align: center;">
              If you have any questions, please contact your administrator.
            </p>
          </div>
          <div class="footer">
            <p class="brand">Mess Management System</p>
            <p>© ${new Date().getFullYear()} All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `Hello ${user.name},\n\nYour account has been created successfully.\n\nEmail: ${user.email}\nTemporary Password: ${password}\n\nPlease change your password after logging in.\n\nLogin at: ${this.config.get("FRONTEND_URL") || "http://localhost:3000"}/login`;

    const host = this.config.get<string>("SMTP_HOST");
    if (!host) {
      this.logger.warn(
        `SMTP is not configured; credential email for ${user.email} was not sent.`,
      );
      return { sent: false };
    }

    try {
      const transporter = nodemailer.createTransport({
        host,
        port: Number(this.config.get("SMTP_PORT", 587)),
        secure: this.config.get("SMTP_SECURE") === "true",
        auth: this.config.get("SMTP_USER")
          ? {
              user: this.config.get("SMTP_USER"),
              pass: this.config.get("SMTP_PASS"),
            }
          : undefined,
      });

      await transporter.sendMail({
        from: this.config.get("SMTP_FROM") || this.config.get("SMTP_USER"),
        to: user.email,
        subject,
        text,
        html,
      });

      await this.prisma.emailLog.create({
        data: {
          userId: user.id,
          email: user.email,
          subject,
          message: text,
          html,
        },
      });

      return { sent: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      this.logger.error(`Failed to send email to ${user.email}:`, errorMessage);
      return { sent: false, error: errorMessage };
    }
  }

  async sendBillEmail(
    user: { id: string; name: string; email: string },
    billAmount: number,
    dueDate: Date,
    month: string,
    details?: {
      mealBill: number;
      utilityShare: number;
      totalBill: number;
      totalPaid: number;
      currentDue: number;
    },
  ) {
    const subject = `💰 Monthly Bill - ${month}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #1e293b;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: #f1f5f9;
          }
          .container {
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          .header {
            background: linear-gradient(135deg, #EF4444, #DC2626);
            padding: 35px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 26px;
            color: #ffffff;
            font-weight: 700;
          }
          .header .subtitle {
            color: rgba(255, 255, 255, 0.85);
            margin-top: 6px;
            font-size: 15px;
          }
          .content {
            padding: 35px 30px;
          }
          .greeting {
            font-size: 17px;
            margin-bottom: 16px;
          }
          .greeting strong {
            color: #4F46E5;
          }
          .bill-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            margin: 20px 0;
          }
          .bill-amount {
            text-align: center;
            padding: 16px 0;
          }
          .bill-amount .amount {
            font-size: 40px;
            font-weight: 700;
            color: #EF4444;
          }
          .bill-amount .currency {
            font-size: 24px;
            color: #64748b;
          }
          .bill-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: 16px;
          }
          .bill-details .item {
            background: white;
            padding: 12px 16px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          .bill-details .item .label {
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: 600;
            letter-spacing: 0.3px;
          }
          .bill-details .item .value {
            font-size: 16px;
            font-weight: 600;
            color: #0f172a;
            margin-top: 2px;
          }
          .bill-details .item .value.positive { color: #059669; }
          .bill-details .item .value.negative { color: #DC2626; }
          .due-box {
            background: #fef3c7;
            border-radius: 10px;
            padding: 16px 20px;
            margin: 20px 0;
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .due-box .icon { font-size: 24px; }
          .due-box .text strong { color: #92400e; display: block; }
          .due-box .text span { color: #78350f; font-size: 14px; }
          .button {
            display: inline-block;
            background: #4F46E5;
            color: #ffffff;
            padding: 14px 36px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: background 0.2s;
          }
          .button:hover { background: #4338CA; }
          .button-container { text-align: center; margin: 25px 0 15px 0; }
          .divider { border: none; border-top: 1px solid #e2e8f0; margin: 25px 0; }
          .footer {
            text-align: center;
            padding: 20px 30px;
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
          }
          .footer p { margin: 4px 0; color: #94a3b8; font-size: 12px; }
          .footer .brand { color: #64748b; font-weight: 600; }
          @media (max-width: 480px) {
            .bill-details { grid-template-columns: 1fr; }
            .header h1 { font-size: 22px; }
            .content { padding: 20px 16px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💰 Monthly Bill</h1>
            <div class="subtitle">${month}</div>
          </div>
          <div class="content">
            <div class="greeting">
              Hello <strong>${user.name}</strong>,
            </div>
            <p>Your monthly bill for <strong>${month}</strong> has been generated.</p>
            
            <div class="bill-card">
              <div class="bill-amount">
                <span class="currency">৳</span>
                <span class="amount">${billAmount.toFixed(2)}</span>
              </div>
              
              <div class="bill-details">
                <div class="item">
                  <div class="label">🍽️ Meal Bill</div>
                  <div class="value">৳ ${(details?.mealBill || 0).toFixed(2)}</div>
                </div>
                <div class="item">
                  <div class="label">⚡ Utility Share</div>
                  <div class="value">৳ ${(details?.utilityShare || 0).toFixed(2)}</div>
                </div>
                <div class="item">
                  <div class="label">💳 Total Paid</div>
                  <div class="value positive">৳ ${(details?.totalPaid || 0).toFixed(2)}</div>
                </div>
                <div class="item">
                  <div class="label">📊 Current Due</div>
                  <div class="value ${(details?.currentDue || 0) > 0 ? "negative" : "positive"}">
                    ৳ ${(details?.currentDue || 0).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
            
            <div class="due-box">
              <span class="icon">📅</span>
              <div class="text">
                <strong>Due Date: ${dueDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</strong>
                <span>Please make your payment before the due date.</span>
              </div>
            </div>
            
            <div class="button-container">
              <a href="${this.config.get("FRONTEND_URL") || "http://localhost:3000"}/payments" class="button">
                💳 Pay Now
              </a>
            </div>
            
            <hr class="divider">
            
            <p style="color: #64748b; font-size: 14px; text-align: center;">
              If you have any questions about your bill, please contact your manager.
            </p>
          </div>
          <div class="footer">
            <p class="brand">Mess Management System</p>
            <p>© ${new Date().getFullYear()} All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `Hello ${user.name},\n\nYour monthly bill for ${month} is ${billAmount} TK.\n\nDetails:\n- Meal Bill: ${details?.mealBill || 0} TK\n- Utility Share: ${details?.utilityShare || 0} TK\n- Total Paid: ${details?.totalPaid || 0} TK\n- Current Due: ${details?.currentDue || 0} TK\n\nDue Date: ${dueDate.toLocaleDateString()}\n\nPlease make your payment before the due date.\n\nLogin at: ${this.config.get("FRONTEND_URL") || "http://localhost:3000"}/payments`;

    const host = this.config.get<string>("SMTP_HOST");
    if (!host) {
      this.logger.warn(
        `SMTP is not configured; bill email for ${user.email} was not sent.`,
      );
      return { sent: false };
    }

    try {
      const transporter = nodemailer.createTransport({
        host,
        port: Number(this.config.get("SMTP_PORT", 587)),
        secure: this.config.get("SMTP_SECURE") === "true",
        auth: this.config.get("SMTP_USER")
          ? {
              user: this.config.get("SMTP_USER"),
              pass: this.config.get("SMTP_PASS"),
            }
          : undefined,
      });

      await transporter.sendMail({
        from: this.config.get("SMTP_FROM") || this.config.get("SMTP_USER"),
        to: user.email,
        subject,
        text,
        html,
      });

      await this.prisma.emailLog.create({
        data: {
          userId: user.id,
          email: user.email,
          subject,
          message: text,
          html,
        },
      });

      return { sent: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      this.logger.error(
        `Failed to send bill email to ${user.email}:`,
        errorMessage,
      );
      return { sent: false, error: errorMessage };
    }
  }

  async sendEmailWithHtml(
    to: string,
    subject: string,
    text: string,
    html: string,
  ) {
    const host = this.config.get<string>("SMTP_HOST");
    if (!host) {
      this.logger.warn(`SMTP is not configured; email to ${to} was not sent.`);
      return { sent: false };
    }

    try {
      const transporter = nodemailer.createTransport({
        host,
        port: Number(this.config.get("SMTP_PORT", 587)),
        secure: this.config.get("SMTP_SECURE") === "true",
        auth: this.config.get("SMTP_USER")
          ? {
              user: this.config.get("SMTP_USER"),
              pass: this.config.get("SMTP_PASS"),
            }
          : undefined,
      });

      await transporter.sendMail({
        from: this.config.get("SMTP_FROM") || this.config.get("SMTP_USER"),
        to,
        subject,
        text,
        html,
      });

      return { sent: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      this.logger.error(`Failed to send email to ${to}:`, errorMessage);
      return { sent: false, error: errorMessage };
    }
  }
}
