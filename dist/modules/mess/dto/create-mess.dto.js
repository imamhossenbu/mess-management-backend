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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMessDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateMessDto {
}
exports.CreateMessDto = CreateMessDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "My Mess" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMessDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "A great mess for students", required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMessDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "123 Main Street, Dhaka", required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMessDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "01712345678", required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMessDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "mess@example.com", required: false }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMessDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Dhaka", required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMessDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Bangladesh", required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMessDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, required: false }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateMessDto.prototype, "maxMembers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "https://example.com/logo.png", required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMessDto.prototype, "logo", void 0);
//# sourceMappingURL=create-mess.dto.js.map