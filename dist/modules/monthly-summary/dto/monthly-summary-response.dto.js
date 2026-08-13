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
exports.GenerateMonthlySummaryDto = exports.MonthlySummaryResponseDto = exports.UserMonthlySummaryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UserMonthlySummaryDto {
}
exports.UserMonthlySummaryDto = UserMonthlySummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserMonthlySummaryDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserMonthlySummaryDto.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UserMonthlySummaryDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UserMonthlySummaryDto.prototype, "totalMeal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UserMonthlySummaryDto.prototype, "mealRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UserMonthlySummaryDto.prototype, "mealBill", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UserMonthlySummaryDto.prototype, "utilityShare", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UserMonthlySummaryDto.prototype, "totalBill", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UserMonthlySummaryDto.prototype, "totalPaid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UserMonthlySummaryDto.prototype, "previousDue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UserMonthlySummaryDto.prototype, "currentDue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], UserMonthlySummaryDto.prototype, "carryToNext", void 0);
class MonthlySummaryResponseDto {
}
exports.MonthlySummaryResponseDto = MonthlySummaryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Whether this month's calculation sheet has been generated" }),
    __metadata("design:type", Boolean)
], MonthlySummaryResponseDto.prototype, "isGenerated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], MonthlySummaryResponseDto.prototype, "month", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MonthlySummaryResponseDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MonthlySummaryResponseDto.prototype, "totalMeals", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MonthlySummaryResponseDto.prototype, "mealRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MonthlySummaryResponseDto.prototype, "totalMealBill", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MonthlySummaryResponseDto.prototype, "totalUtilityBill", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MonthlySummaryResponseDto.prototype, "totalBill", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MonthlySummaryResponseDto.prototype, "totalPaid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MonthlySummaryResponseDto.prototype, "totalDue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [UserMonthlySummaryDto] }),
    __metadata("design:type", Array)
], MonthlySummaryResponseDto.prototype, "userSummaries", void 0);
class GenerateMonthlySummaryDto {
}
exports.GenerateMonthlySummaryDto = GenerateMonthlySummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2026 }),
    __metadata("design:type", Number)
], GenerateMonthlySummaryDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8 }),
    __metadata("design:type", Number)
], GenerateMonthlySummaryDto.prototype, "month", void 0);
//# sourceMappingURL=monthly-summary-response.dto.js.map