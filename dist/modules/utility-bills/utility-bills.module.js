"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilityBillsModule = void 0;
const common_1 = require("@nestjs/common");
const utility_bills_service_1 = require("./utility-bills.service");
const utility_bills_controller_1 = require("./utility-bills.controller");
const notifications_module_1 = require("../notifications/notifications.module");
let UtilityBillsModule = class UtilityBillsModule {
};
exports.UtilityBillsModule = UtilityBillsModule;
exports.UtilityBillsModule = UtilityBillsModule = __decorate([
    (0, common_1.Module)({
        imports: [notifications_module_1.NotificationsModule],
        controllers: [utility_bills_controller_1.UtilityBillsController],
        providers: [utility_bills_service_1.UtilityBillsService],
        exports: [utility_bills_service_1.UtilityBillsService],
    })
], UtilityBillsModule);
//# sourceMappingURL=utility-bills.module.js.map