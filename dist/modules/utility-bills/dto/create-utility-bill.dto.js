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
exports.CreateUtilityBillDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateUtilityBillDto {
}
exports.CreateUtilityBillDto = CreateUtilityBillDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.BillType, example: "CURRENT" }),
    (0, class_validator_1.IsEnum)(client_1.BillType),
    __metadata("design:type", String)
], CreateUtilityBillDto.prototype, "billType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-08-01", description: "বিলের মাস (১লা তারিখ)" }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateUtilityBillDto.prototype, "monthYear", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateUtilityBillDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "user-id-123",
        required: false,
        description: "কে জমা দিয়েছে",
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUtilityBillDto.prototype, "paidBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "এই মাসের বিল বেশি হয়েছে", required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUtilityBillDto.prototype, "note", void 0);
//# sourceMappingURL=create-utility-bill.dto.js.map