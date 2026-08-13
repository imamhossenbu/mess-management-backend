"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const meals_module_1 = require("./modules/meals/meals.module");
const marketings_module_1 = require("./modules/marketings/marketings.module");
const inventory_module_1 = require("./modules/inventory/inventory.module");
const utility_bills_module_1 = require("./modules/utility-bills/utility-bills.module");
const shop_debts_module_1 = require("./modules/shop-debts/shop-debts.module");
const payments_module_1 = require("./modules/payments/payments.module");
const monthly_summary_module_1 = require("./modules/monthly-summary/monthly-summary.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const health_module_1 = require("./modules/health/health.module");
const cloudinary_module_1 = require("./modules/cloudinary/cloudinary.module");
const mess_middleware_1 = require("./common/middleware/mess.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(mess_middleware_1.MessMiddleware)
            .exclude({ path: "auth/(.*)", method: common_1.RequestMethod.ALL }, { path: "health/(.*)", method: common_1.RequestMethod.ALL }, { path: "mess", method: common_1.RequestMethod.POST }, { path: "mess/user/messes", method: common_1.RequestMethod.GET })
            .forRoutes("*");
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ".env",
            }),
            prisma_module_1.PrismaModule,
            cloudinary_module_1.CloudinaryModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            meals_module_1.MealsModule,
            marketings_module_1.MarketingsModule,
            inventory_module_1.InventoryModule,
            utility_bills_module_1.UtilityBillsModule,
            shop_debts_module_1.ShopDebtsModule,
            payments_module_1.PaymentsModule,
            monthly_summary_module_1.MonthlySummaryModule,
            dashboard_module_1.DashboardModule,
            notifications_module_1.NotificationsModule,
            health_module_1.HealthModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map