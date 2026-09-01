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
exports.CreateBulkShopDebtDto = exports.CreateShopDebtDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class CreateShopDebtDto {
}
exports.CreateShopDebtDto = CreateShopDebtDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "MR Traders", required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateShopDebtDto.prototype, "shopName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-08-08", required: false }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateShopDebtDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "চাল, ডাল, তেল, মসলা", required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateShopDebtDto.prototype, "itemDetails", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5000, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateShopDebtDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "আগস্ট মাসের বাকি", required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateShopDebtDto.prototype, "note", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CreateShopDebtDto], required: false }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateShopDebtDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateShopDebtDto.prototype, "items", void 0);
class CreateBulkShopDebtDto {
}
exports.CreateBulkShopDebtDto = CreateBulkShopDebtDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "MR Traders", required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBulkShopDebtDto.prototype, "shopName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-08-08", required: false }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBulkShopDebtDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "আগস্ট মাসের বাকি", required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBulkShopDebtDto.prototype, "note", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CreateShopDebtDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateShopDebtDto),
    __metadata("design:type", Array)
], CreateBulkShopDebtDto.prototype, "items", void 0);
//# sourceMappingURL=create-shop-debt.dto.js.map