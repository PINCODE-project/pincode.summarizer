import {Controller, Get, Post, Request, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {LocalAuthGuard} from "./guards/local-auth.guard";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import {
    ApiBearerAuth,
    ApiBody,
    ApiExcludeEndpoint,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse
} from "@nestjs/swagger";
import {LoginDto, LoginResponseDto, LoginUnauthorizedDto} from "./dto/loginDto";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @ApiOperation({summary: "Авторизация пользователя"})
    @ApiBody({type: LoginDto})
    @ApiOkResponse({description: "Пользователь успешно авторизован", type: LoginResponseDto})
    @ApiUnauthorizedResponse({description: "Неверный логин или пароль!", type: LoginUnauthorizedDto})
    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @ApiExcludeEndpoint()
    @ApiBearerAuth()
    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@Request() req) {
        return req.user;
    }
}
