"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkNotificationDto = exports.SendEmailDto = exports.CreateNotificationDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateNotificationDto {
}
exports.CreateNotificationDto = CreateNotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "user-id-123" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.NotificationType, example: "BILL" }),
    (0, class_validator_1.IsEnum)(client_1.NotificationType),
    __metadata("design:type", typeof (_a = typeof client_1.NotificationType !== "undefined" && client_1.NotificationType) === "function" ? _a : Object)
], CreateNotificationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "মাসিক বিল" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "আপনার এই মাসের বিল ১০,৫৫০ টাকা" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "/bills", required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "link", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateNotificationDto.prototype, "isRead", void 0);
class SendEmailDto {
}
exports.SendEmailDto = SendEmailDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "user@example.com" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendEmailDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "মাসিক বিল" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendEmailDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "আপনার এই মাসের বিল ১০,৫৫০ টাকা" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendEmailDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SendEmailDto.prototype, "html", void 0);
class BulkNotificationDto {
}
exports.BulkNotificationDto = BulkNotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], example: ["user-id-1", "user-id-2"] }),
    (0, class_validator_1.IsUUID)("4", { each: true }),
    __metadata("design:type", Array)
], BulkNotificationDto.prototype, "userIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.NotificationType, example: "BILL" }),
    (0, class_validator_1.IsEnum)(client_1.NotificationType),
    __metadata("design:type", typeof (_b = typeof client_1.NotificationType !== "undefined" && client_1.NotificationType) === "function" ? _b : Object)
], BulkNotificationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "মাসিক বিল" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BulkNotificationDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "আপনার এই মাসের বিল তৈরি হয়েছে" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BulkNotificationDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "/bills", required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], BulkNotificationDto.prototype, "link", void 0);
//# sourceMappingURL=create-notification.dto.js.map