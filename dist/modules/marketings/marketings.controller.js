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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketingsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const marketings_service_1 = require("./marketings.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../../common/roles.decorator");
let MarketingsController = class MarketingsController {
    constructor(marketingsService) {
        this.marketingsService = marketingsService;
    }
    async create(req, createMarketingDto, file) {
        console.log("🔍 [CREATE] Raw body:", createMarketingDto);
        console.log("🔍 [CREATE] Raw items:", createMarketingDto.items);
        console.log("🔍 [CREATE] Type of items:", typeof createMarketingDto.items);
        console.log("🔍 [CREATE] File:", file ? "Yes" : "No");
        let items = createMarketingDto.items;
        if (typeof items === "string") {
            try {
                items = JSON.parse(items);
                console.log("✅ [CREATE] Parsed items:", items);
            }
            catch (e) {
                console.error("❌ [CREATE] Parse error:", e);
                throw new common_1.BadRequestException("Invalid items format. Must be valid JSON array.");
            }
        }
        if (!Array.isArray(items)) {
            console.error("❌ [CREATE] items is not an array:", items);
            throw new common_1.BadRequestException("items must be an array");
        }
        if (items.length === 0) {
            throw new common_1.BadRequestException("At least one item is required");
        }
        for (const item of items) {
            console.log("🔍 [CREATE] Validating item:", item);
            if (!item.itemName || item.itemName.trim() === "") {
                throw new common_1.BadRequestException("Each item must have a valid itemName");
            }
            if (!item.price || item.price <= 0) {
                throw new common_1.BadRequestException("Each item must have a valid price greater than 0");
            }
        }
        const dto = {
            ...createMarketingDto,
            items: items,
        };
        console.log("✅ [CREATE] Final DTO:", dto);
        return this.marketingsService.create(req.user.id, dto, file);
    }
    async findAll() {
        return this.marketingsService.findAll();
    }
    async findByUser(userId, startDate, endDate) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.marketingsService.findByUser(userId, start, end);
    }
    async findByDate(date) {
        return this.marketingsService.findByDate(new Date(date));
    }
    async getDailySummary(date) {
        const queryDate = date ? new Date(date) : new Date();
        return this.marketingsService.getDailySummary(queryDate);
    }
    async getMonthlySummary(year, month) {
        let queryYear = new Date().getFullYear();
        let queryMonth = new Date().getMonth() + 1;
        if (year) {
            const parsedYear = parseInt(year);
            if (!isNaN(parsedYear) && parsedYear > 2000 && parsedYear < 2100) {
                queryYear = parsedYear;
            }
        }
        if (month) {
            const parsedMonth = parseInt(month);
            if (!isNaN(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12) {
                queryMonth = parsedMonth;
            }
        }
        return this.marketingsService.getMonthlySummary(queryYear, queryMonth);
    }
    async findOne(id) {
        return this.marketingsService.findOne(id);
    }
    async update(id, updateMarketingDto, file) {
        console.log("🔍 [UPDATE] Raw body:", updateMarketingDto);
        console.log("🔍 [UPDATE] Raw items:", updateMarketingDto.items);
        console.log("🔍 [UPDATE] Type of items:", typeof updateMarketingDto.items);
        console.log("🔍 [UPDATE] File:", file ? "Yes" : "No");
        let items = updateMarketingDto.items;
        if (typeof items === "string") {
            try {
                items = JSON.parse(items);
                console.log("✅ [UPDATE] Parsed items:", items);
            }
            catch (e) {
                console.error("❌ [UPDATE] Parse error:", e);
                throw new common_1.BadRequestException("Invalid items format. Must be valid JSON array.");
            }
        }
        if (items !== undefined && items !== null) {
            console.log("🔍 [UPDATE] Items after parse:", items);
            console.log("🔍 [UPDATE] Is array?", Array.isArray(items));
            if (!Array.isArray(items)) {
                throw new common_1.BadRequestException("items must be an array");
            }
            if (items.length === 0) {
                throw new common_1.BadRequestException("At least one item is required");
            }
            for (const item of items) {
                console.log("🔍 [UPDATE] Validating item:", item);
                if (!item.itemName || item.itemName.trim() === "") {
                    throw new common_1.BadRequestException("Each item must have a valid itemName");
                }
                if (!item.price || item.price <= 0) {
                    throw new common_1.BadRequestException("Each item must have a valid price greater than 0");
                }
            }
        }
        const dto = {
            ...updateMarketingDto,
            items: items,
        };
        console.log("✅ [UPDATE] Final DTO:", dto);
        return this.marketingsService.update(id, dto, file);
    }
    async remove(id) {
        return this.marketingsService.remove(id);
    }
    async removeByDate(date) {
        return this.marketingsService.removeByDate(new Date(date));
    }
};
exports.MarketingsController = MarketingsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER", "MEMBER"),
    (0, swagger_1.ApiOperation)({ summary: "Create a new marketing/bazar entry with image" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("image")),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: false })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateMarketingDto, Object]),
    __metadata("design:returntype", Promise)
], MarketingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER", "MEMBER"),
    (0, swagger_1.ApiOperation)({ summary: "Get all marketing entries" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MarketingsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("user/:userId"),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER", "MEMBER"),
    (0, swagger_1.ApiOperation)({ summary: "Get marketing entries by user" }),
    (0, swagger_1.ApiQuery)({ name: "startDate", required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: "endDate", required: false, type: String }),
    __param(0, (0, common_1.Param)("userId")),
    __param(1, (0, common_1.Query)("startDate")),
    __param(2, (0, common_1.Query)("endDate")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], MarketingsController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)("date/:date"),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER", "MEMBER"),
    (0, swagger_1.ApiOperation)({ summary: "Get marketing entries by date" }),
    __param(0, (0, common_1.Param)("date")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MarketingsController.prototype, "findByDate", null);
__decorate([
    (0, common_1.Get)("daily"),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER", "MEMBER"),
    (0, swagger_1.ApiOperation)({ summary: "Get daily marketing summary" }),
    (0, swagger_1.ApiQuery)({ name: "date", required: false, type: String }),
    __param(0, (0, common_1.Query)("date")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MarketingsController.prototype, "getDailySummary", null);
__decorate([
    (0, common_1.Get)("monthly"),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER", "MEMBER"),
    (0, swagger_1.ApiOperation)({ summary: "Get monthly marketing summary" }),
    (0, swagger_1.ApiQuery)({ name: "year", required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: "month", required: false, type: Number }),
    __param(0, (0, common_1.Query)("year")),
    __param(1, (0, common_1.Query)("month")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MarketingsController.prototype, "getMonthlySummary", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER", "MEMBER"),
    (0, swagger_1.ApiOperation)({ summary: "Get marketing entry by ID" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Marketing ID" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MarketingsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER", "MEMBER"),
    (0, swagger_1.ApiOperation)({ summary: "Update marketing entry" }),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiParam)({ name: "id", description: "Marketing ID" }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("image")),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: false })),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateMarketingDto, Object]),
    __metadata("design:returntype", Promise)
], MarketingsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER", "MEMBER"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Delete marketing entry" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Marketing ID" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MarketingsController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)("date/:date"),
    (0, roles_decorator_1.Roles)("ADMIN", "MANAGER"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Delete all marketing entries for a date" }),
    __param(0, (0, common_1.Param)("date")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MarketingsController.prototype, "removeByDate", null);
exports.MarketingsController = MarketingsController = __decorate([
    (0, swagger_1.ApiTags)("marketings"),
    (0, swagger_1.ApiBearerAuth)("JWT-auth"),
    (0, common_1.Controller)("marketings"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [marketings_service_1.MarketingsService])
], MarketingsController);
//# sourceMappingURL=marketings.controller.js.map