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
exports.UpdateMarketingDto = exports.UpdateMarketingItemDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
class UpdateMarketingItemDto {
}
exports.UpdateMarketingItemDto = UpdateMarketingItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMarketingItemDto.prototype, "itemName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateMarketingItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.Unit, required: false }),
    (0, class_validator_1.IsEnum)(client_1.Unit),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMarketingItemDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateMarketingItemDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateMarketingItemDto.prototype, "totalPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMarketingItemDto.prototype, "note", void 0);
class UpdateMarketingDto {
}
exports.UpdateMarketingDto = UpdateMarketingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMarketingDto.prototype, "shopName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.PaymentType, required: false }),
    (0, class_validator_1.IsEnum)(client_1.PaymentType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMarketingDto.prototype, "paymentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMarketingDto.prototype, "note", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [UpdateMarketingItemDto], required: false }),
    (0, class_transformer_1.Transform)(({ value }) => {
        let parsed = value;
        if (typeof value === "string") {
            try {
                parsed = JSON.parse(value);
            }
            catch {
                return value;
            }
        }
        if (!Array.isArray(parsed))
            return parsed;
        return (0, class_transformer_1.plainToInstance)(UpdateMarketingItemDto, parsed);
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => UpdateMarketingItemDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateMarketingDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: "Set to true to remove the existing image",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === "true" || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateMarketingDto.prototype, "removeImage", void 0);
//# sourceMappingURL=update-marketing.dto.js.map