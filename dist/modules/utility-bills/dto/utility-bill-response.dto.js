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
exports.UtilityBillSummaryDto = exports.MonthlyUtilitySummaryDto = exports.UtilityBillResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class UtilityBillResponseDto {
}
exports.UtilityBillResponseDto = UtilityBillResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UtilityBillResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UtilityBillResponseDto.prototype, "billType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], UtilityBillResponseDto.prototype, "monthYear", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UtilityBillResponseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UtilityBillResponseDto.prototype, "paidBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UtilityBillResponseDto.prototype, "paidByName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UtilityBillResponseDto.prototype, "note", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], UtilityBillResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], UtilityBillResponseDto.prototype, "updatedAt", void 0);
class MonthlyUtilitySummaryDto {
}
exports.MonthlyUtilitySummaryDto = MonthlyUtilitySummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MonthlyUtilitySummaryDto.prototype, "month", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MonthlyUtilitySummaryDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MonthlyUtilitySummaryDto.prototype, "totalCurrent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MonthlyUtilitySummaryDto.prototype, "totalWifi", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MonthlyUtilitySummaryDto.prototype, "totalRent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MonthlyUtilitySummaryDto.prototype, "totalWater", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MonthlyUtilitySummaryDto.prototype, "totalKhala", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MonthlyUtilitySummaryDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MonthlyUtilitySummaryDto.prototype, "perPersonShare", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MonthlyUtilitySummaryDto.prototype, "totalMembers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [UtilityBillResponseDto] }),
    __metadata("design:type", Array)
], MonthlyUtilitySummaryDto.prototype, "bills", void 0);
class UtilityBillSummaryDto {
}
exports.UtilityBillSummaryDto = UtilityBillSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UtilityBillSummaryDto.prototype, "totalCurrent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UtilityBillSummaryDto.prototype, "totalWifi", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UtilityBillSummaryDto.prototype, "totalRent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UtilityBillSummaryDto.prototype, "totalWater", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UtilityBillSummaryDto.prototype, "totalKhala", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UtilityBillSummaryDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UtilityBillSummaryDto.prototype, "perPersonShare", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UtilityBillSummaryDto.prototype, "totalMembers", void 0);
//# sourceMappingURL=utility-bill-response.dto.js.map