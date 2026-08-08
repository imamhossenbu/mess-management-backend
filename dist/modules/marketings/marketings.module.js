"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketingsModule = void 0;
const common_1 = require("@nestjs/common");
const marketings_service_1 = require("./marketings.service");
const marketings_controller_1 = require("./marketings.controller");
const inventory_module_1 = require("../inventory/inventory.module");
let MarketingsModule = class MarketingsModule {
};
exports.MarketingsModule = MarketingsModule;
exports.MarketingsModule = MarketingsModule = __decorate([
    (0, common_1.Module)({
        imports: [inventory_module_1.InventoryModule],
        controllers: [marketings_controller_1.MarketingsController],
        providers: [marketings_service_1.MarketingsService],
        exports: [marketings_service_1.MarketingsService],
    })
], MarketingsModule);
//# sourceMappingURL=marketings.module.js.map