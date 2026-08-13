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
exports.CreateMarketingDto = exports.MarketingItemDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
class MarketingItemDto {
}
exports.MarketingItemDto = MarketingItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Rui Fish" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MarketingItemDto.prototype, "itemName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], MarketingItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.Unit, example: "KG" }),
    (0, class_validator_1.IsEnum)(client_1.Unit),
    __metadata("design:type", String)
], MarketingItemDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 350 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], MarketingItemDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 700 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], MarketingItemDto.prototype, "totalPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MarketingItemDto.prototype, "note", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: "Add this item to inventory",
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], MarketingItemDto.prototype, "addToInventory", void 0);
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
    (0, swagger_1.ApiProperty)({ example: "Kacha Bazar", required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMarketingDto.prototype, "shopName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.PaymentType, default: client_1.PaymentType.CASH }),
    (0, class_validator_1.IsEnum)(client_1.PaymentType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMarketingDto.prototype, "paymentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [MarketingItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => MarketingItemDto),
    __metadata("design:type", Array)
], CreateMarketingDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Daily bazar purchase", required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMarketingDto.prototype, "note", void 0);
//# sourceMappingURL=create-marketing.dto.js.map