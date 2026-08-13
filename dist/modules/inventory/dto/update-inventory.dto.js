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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetInventoryDto = exports.RemoveInventoryDto = exports.AddInventoryDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class AddInventoryDto {
}
exports.AddInventoryDto = AddInventoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.InventoryType, example: 'MEAT' }),
    (0, class_validator_1.IsEnum)(client_1.InventoryType),
    __metadata("design:type", typeof (_a = typeof client_1.InventoryType !== "undefined" && client_1.InventoryType) === "function" ? _a : Object)
], AddInventoryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25, description: 'কত পিস যোগ করবেন' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], AddInventoryDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'marketing-id-123',
        description: 'কোন বাজার থেকে যোগ করছেন (Marketing ID)',
        required: false
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddInventoryDto.prototype, "marketingId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'বাজার থেকে ২৫ পিস মুরগি কেনা হয়েছে', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddInventoryDto.prototype, "note", void 0);
class RemoveInventoryDto {
}
exports.RemoveInventoryDto = RemoveInventoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.InventoryType, example: 'MEAT' }),
    (0, class_validator_1.IsEnum)(client_1.InventoryType),
    __metadata("design:type", typeof (_b = typeof client_1.InventoryType !== "undefined" && client_1.InventoryType) === "function" ? _b : Object)
], RemoveInventoryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'কত পিস বিয়োগ করবেন' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], RemoveInventoryDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'রান্নায় ১০ পিস ব্যবহার করা হয়েছে', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RemoveInventoryDto.prototype, "note", void 0);
class SetInventoryDto {
}
exports.SetInventoryDto = SetInventoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.InventoryType, example: 'MEAT' }),
    (0, class_validator_1.IsEnum)(client_1.InventoryType),
    __metadata("design:type", typeof (_c = typeof client_1.InventoryType !== "undefined" && client_1.InventoryType) === "function" ? _c : Object)
], SetInventoryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 15, description: 'মোট কত পিস আছে' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], SetInventoryDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'স্টক চেক করে আপডেট করা হয়েছে', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SetInventoryDto.prototype, "note", void 0);
//# sourceMappingURL=update-inventory.dto.js.map