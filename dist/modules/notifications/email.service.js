"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
const prisma_service_1 = require("../../prisma/prisma.service");
let EmailService = EmailService_1 = class EmailService {
    constructor(config, prisma) {
        this.config = config;
        this.prisma = prisma;
        this.logger = new common_1.Logger(EmailService_1.name);
    }
    async sendCredentials(user, password, messName) {
        const subject = `Your ${messName} account credentials`;
        const text = `Hello ${user.name}, your account has been approved for ${messName}. Email: ${user.email}. Temporary password: ${password}. Please change it after signing in.`;
        const html = `<p>Hello ${user.name},</p><p>Your account has been approved for <strong>${messName}</strong>.</p><p>Email: <strong>${user.email}</strong><br/>Temporary password: <strong>${password}</strong></p><p>Please change your password after signing in.</p>`;
        const host = this.config.get("SMTP_HOST");
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
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], EmailService);
//# sourceMappingURL=email.service.js.map