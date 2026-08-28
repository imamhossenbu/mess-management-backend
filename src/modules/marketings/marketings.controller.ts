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
  UseInterceptors,
  UploadedFile,
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
  async create(
    @Request() req,
    @Body() createMarketingDto: CreateMarketingDto,
    @UploadedFile() file?: any,
  ) {
    return this.marketingsService.create(req.user.id, createMarketingDto, file);
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
  async update(
    @Param("id") id: string,
    @Body() updateMarketingDto: UpdateMarketingDto,
    @UploadedFile() file?: any,
  ) {
    return this.marketingsService.update(id, updateMarketingDto, file);
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
  @Roles("ADMIN", "MANAGER", "MEMBER")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete all marketing entries for a date" })
  async removeByDate(@Param("date") date: string) {
    return this.marketingsService.removeByDate(new Date(date));
  }
}
