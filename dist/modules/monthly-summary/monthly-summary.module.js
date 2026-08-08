"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthlySummaryModule = void 0;
const common_1 = require("@nestjs/common");
const monthly_summary_service_1 = require("./monthly-summary.service");
const monthly_summary_controller_1 = require("./monthly-summary.controller");
let MonthlySummaryModule = class MonthlySummaryModule {
};
exports.MonthlySummaryModule = MonthlySummaryModule;
exports.MonthlySummaryModule = MonthlySummaryModule = __decorate([
    (0, common_1.Module)({
        controllers: [monthly_summary_controller_1.MonthlySummaryController],
        providers: [monthly_summary_service_1.MonthlySummaryService],
        exports: [monthly_summary_service_1.MonthlySummaryService],
    })
], MonthlySummaryModule);
//# sourceMappingURL=monthly-summary.module.js.map