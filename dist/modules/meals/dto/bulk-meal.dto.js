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
exports.SingleMealEntryDto = exports.BulkMealEntryDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class BulkMealEntryDto {
}
exports.BulkMealEntryDto = BulkMealEntryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-08-08" }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], BulkMealEntryDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Breakfast (সকাল)" }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], BulkMealEntryDto.prototype, "morningUserIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Lunch (দুপুর)" }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], BulkMealEntryDto.prototype, "lunchUserIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Dinner (রাত)" }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], BulkMealEntryDto.prototype, "dinnerUserIds", void 0);
class SingleMealEntryDto {
}
exports.SingleMealEntryDto = SingleMealEntryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-08-08" }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], SingleMealEntryDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ["morning", "lunch", "dinner"] }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SingleMealEntryDto.prototype, "mealType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], SingleMealEntryDto.prototype, "userIds", void 0);
//# sourceMappingURL=bulk-meal.dto.js.map