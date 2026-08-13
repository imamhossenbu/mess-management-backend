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
exports.CreateMarketingDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateMarketingDto {
}
exports.CreateMarketingDto = CreateMarketingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-08-08", required: false }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMarketingDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "মুরগি" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMarketingDto.prototype, "itemName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2 kg", required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMarketingDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 500 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateMarketingDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.PaymentType, default: client_1.PaymentType.CASH }),
    (0, class_validator_1.IsEnum)(client_1.PaymentType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMarketingDto.prototype, "paymentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "MR Traders", required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMarketingDto.prototype, "shopName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ["MEAT", "FISH"],
        required: false,
        description: "ইনভেন্টরি টাইপ (মাংস বা মাছ)",
    }),
    (0, class_validator_1.IsEnum)(["MEAT", "FISH"]),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMarketingDto.prototype, "inventoryType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 25,
        required: false,
        description: "মোট কত পিস পেলেন (ইনভেন্টরিতে যোগ হবে)",
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateMarketingDto.prototype, "totalPieces", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 10,
        required: false,
        description: "আজকে রান্নায় কত পিস ব্যবহার করলেন (ইনভেন্টরি থেকে বিয়োগ হবে)",
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateMarketingDto.prototype, "usedPieces", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "আজকে ২৫ পিস মুরগি পেয়েছি", required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMarketingDto.prototype, "note", void 0);
//# sourceMappingURL=create-marketing.dto.js.map