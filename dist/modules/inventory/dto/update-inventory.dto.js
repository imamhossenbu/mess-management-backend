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
exports.UpdateInventoryItemDto = exports.SetInventoryDto = exports.RemoveInventoryDto = exports.AddInventoryDto = exports.CreateInventoryItemDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateInventoryItemDto {
}
exports.CreateInventoryItemDto = CreateInventoryItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Rui Fish" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInventoryItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.InventoryCategory, example: "FISH" }),
    (0, class_validator_1.IsEnum)(client_1.InventoryCategory),
    __metadata("design:type", String)
], CreateInventoryItemDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.Unit, example: "KG" }),
    (0, class_validator_1.IsEnum)(client_1.Unit),
    __metadata("design:type", String)
], CreateInventoryItemDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInventoryItemDto.prototype, "initialQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInventoryItemDto.prototype, "minStockLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 350, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateInventoryItemDto.prototype, "purchasePrice", void 0);
class AddInventoryDto {
}
exports.AddInventoryDto = AddInventoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Rui Fish" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddInventoryDto.prototype, "itemName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], AddInventoryDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.Unit, example: "KG" }),
    (0, class_validator_1.IsEnum)(client_1.Unit),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddInventoryDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Purchase from bazar", required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddInventoryDto.prototype, "note", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddInventoryDto.prototype, "marketingId", void 0);
class RemoveInventoryDto {
}
exports.RemoveInventoryDto = RemoveInventoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Rui Fish" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RemoveInventoryDto.prototype, "itemName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], RemoveInventoryDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Used for cooking", required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RemoveInventoryDto.prototype, "note", void 0);
class SetInventoryDto {
}
exports.SetInventoryDto = SetInventoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Rui Fish" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SetInventoryDto.prototype, "itemName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], SetInventoryDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Stock updated", required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SetInventoryDto.prototype, "note", void 0);
class UpdateInventoryItemDto {
}
exports.UpdateInventoryItemDto = UpdateInventoryItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateInventoryItemDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.InventoryCategory, required: false }),
    (0, class_validator_1.IsEnum)(client_1.InventoryCategory),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateInventoryItemDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.Unit, required: false }),
    (0, class_validator_1.IsEnum)(client_1.Unit),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateInventoryItemDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateInventoryItemDto.prototype, "minStockLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateInventoryItemDto.prototype, "purchasePrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateInventoryItemDto.prototype, "isActive", void 0);
//# sourceMappingURL=update-inventory.dto.js.map