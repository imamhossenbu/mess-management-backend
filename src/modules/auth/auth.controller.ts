// src/modules/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Res,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto, AuthResponseDto } from "./dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { ConfigService } from "@nestjs/config";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login user" })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user profile" })
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth() {
    // Redirects to Google
  }

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthRedirect(@Request() req, @Res() res) {
    try {
      const result = await this.authService.googleLogin(req.user);
      const frontendUrl =
        this.configService.get("FRONTEND_URL") || "http://localhost:3000";
      const params = new URLSearchParams({
        token: result.accessToken,
        user: JSON.stringify(result.user),
      });
      return res.redirect(`${frontendUrl}/auth/callback?${params.toString()}`);
    } catch (error) {
      const frontendUrl =
        this.configService.get("FRONTEND_URL") || "http://localhost:3000";
      return res.redirect(`${frontendUrl}/login?error=google_auth_failed`);
    }
  }
}
