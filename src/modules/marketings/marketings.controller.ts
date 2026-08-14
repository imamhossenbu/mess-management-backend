// src/modules/marketings/marketings.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
  Request,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiConsumes,
} from "@nestjs/swagger";
import { MarketingsService } from "./marketings.service";
import { CreateMarketingDto, UpdateMarketingDto } from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../../common/roles.decorator";

@ApiTags("marketings")
@ApiBearerAuth("JWT-auth")
@Controller("marketings")
@UseGuards(JwtAuthGuard, RolesGuard)
export class MarketingsController {
  constructor(private readonly marketingsService: MarketingsService) {}

  @Post()
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Create a new marketing/bazar entry with image" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("image"))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: false }))
  async create(
    @Request() req,
    @Body() createMarketingDto: CreateMarketingDto,
    @UploadedFile() file?: any,
  ) {
    console.log("🔍 [CREATE] Raw body:", createMarketingDto);
    console.log("🔍 [CREATE] Raw items:", createMarketingDto.items);
    console.log("🔍 [CREATE] Type of items:", typeof createMarketingDto.items);
    console.log("🔍 [CREATE] File:", file ? "Yes" : "No");

    let items = createMarketingDto.items;

    if (typeof items === "string") {
      try {
        items = JSON.parse(items);
        console.log("✅ [CREATE] Parsed items:", items);
      } catch (e) {
        console.error("❌ [CREATE] Parse error:", e);
        throw new BadRequestException(
          "Invalid items format. Must be valid JSON array.",
        );
      }
    }

    if (!Array.isArray(items)) {
      console.error("❌ [CREATE] items is not an array:", items);
      throw new BadRequestException("items must be an array");
    }

    if (items.length === 0) {
      throw new BadRequestException("At least one item is required");
    }

    for (const item of items) {
      console.log("🔍 [CREATE] Validating item:", item);
      if (!item.itemName || item.itemName.trim() === "") {
        throw new BadRequestException("Each item must have a valid itemName");
      }
      if (!item.price || item.price <= 0) {
        throw new BadRequestException(
          "Each item must have a valid price greater than 0",
        );
      }
    }

    const dto = {
      ...createMarketingDto,
      items: items,
    };

    console.log("✅ [CREATE] Final DTO:", dto);
    return this.marketingsService.create(req.user.id, dto, file);
  }

  @Get()
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get all marketing entries" })
  async findAll() {
    return this.marketingsService.findAll();
  }

  @Get("user/:userId")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get marketing entries by user" })
  @ApiQuery({ name: "startDate", required: false, type: String })
  @ApiQuery({ name: "endDate", required: false, type: String })
  async findByUser(
    @Param("userId") userId: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.marketingsService.findByUser(userId, start, end);
  }

  @Get("date/:date")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get marketing entries by date" })
  async findByDate(@Param("date") date: string) {
    return this.marketingsService.findByDate(new Date(date));
  }

  @Get("daily")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get daily marketing summary" })
  @ApiQuery({ name: "date", required: false, type: String })
  async getDailySummary(@Query("date") date?: string) {
    const queryDate = date ? new Date(date) : new Date();
    return this.marketingsService.getDailySummary(queryDate);
  }

  @Get("monthly")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get monthly marketing summary" })
  @ApiQuery({ name: "year", required: false, type: Number })
  @ApiQuery({ name: "month", required: false, type: Number })
  async getMonthlySummary(
    @Query("year") year?: string,
    @Query("month") month?: string,
  ) {
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

  @Get(":id")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Get marketing entry by ID" })
  @ApiParam({ name: "id", description: "Marketing ID" })
  async findOne(@Param("id") id: string) {
    return this.marketingsService.findOne(id);
  }

  @Patch(":id")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @ApiOperation({ summary: "Update marketing entry" })
  @ApiConsumes("multipart/form-data")
  @ApiParam({ name: "id", description: "Marketing ID" })
  @UseInterceptors(FileInterceptor("image"))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: false }))
  async update(
    @Param("id") id: string,
    @Body() updateMarketingDto: UpdateMarketingDto,
    @UploadedFile() file?: any,
  ) {
    console.log("🔍 [UPDATE] Raw body:", updateMarketingDto);
    console.log("🔍 [UPDATE] Raw items:", updateMarketingDto.items);
    console.log("🔍 [UPDATE] Type of items:", typeof updateMarketingDto.items);
    console.log("🔍 [UPDATE] File:", file ? "Yes" : "No");

    let items = updateMarketingDto.items;

    if (typeof items === "string") {
      try {
        items = JSON.parse(items);
        console.log("✅ [UPDATE] Parsed items:", items);
      } catch (e) {
        console.error("❌ [UPDATE] Parse error:", e);
        throw new BadRequestException(
          "Invalid items format. Must be valid JSON array.",
        );
      }
    }

    if (items !== undefined && items !== null) {
      console.log("🔍 [UPDATE] Items after parse:", items);
      console.log("🔍 [UPDATE] Is array?", Array.isArray(items));

      if (!Array.isArray(items)) {
        throw new BadRequestException("items must be an array");
      }

      if (items.length === 0) {
        throw new BadRequestException("At least one item is required");
      }

      for (const item of items) {
        console.log("🔍 [UPDATE] Validating item:", item);
        if (!item.itemName || item.itemName.trim() === "") {
          throw new BadRequestException("Each item must have a valid itemName");
        }
        if (!item.price || item.price <= 0) {
          throw new BadRequestException(
            "Each item must have a valid price greater than 0",
          );
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

  @Delete(":id")
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete marketing entry" })
  @ApiParam({ name: "id", description: "Marketing ID" })
  async remove(@Param("id") id: string) {
    return this.marketingsService.remove(id);
  }

  @Delete("date/:date")
  @Roles("ADMIN", "MANAGER")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete all marketing entries for a date" })
  async removeByDate(@Param("date") date: string) {
    return this.marketingsService.removeByDate(new Date(date));
  }
}
