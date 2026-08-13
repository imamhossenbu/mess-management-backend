"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopDebtsModule = void 0;
const common_1 = require("@nestjs/common");
const shop_debts_service_1 = require("./shop-debts.service");
const shop_debts_controller_1 = require("./shop-debts.controller");
const notifications_module_1 = require("../notifications/notifications.module");
let ShopDebtsModule = class ShopDebtsModule {
};
exports.ShopDebtsModule = ShopDebtsModule;
exports.ShopDebtsModule = ShopDebtsModule = __decorate([
    (0, common_1.Module)({
        imports: [notifications_module_1.NotificationsModule],
        controllers: [shop_debts_controller_1.ShopDebtsController],
        providers: [shop_debts_service_1.ShopDebtsService],
        exports: [shop_debts_service_1.ShopDebtsService],
    })
], ShopDebtsModule);
//# sourceMappingURL=shop-debts.module.js.map