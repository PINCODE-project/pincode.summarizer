import {Body, Controller, Delete, Get, Param, Post, Req, UseGuards} from '@nestjs/common';
import {UserService} from './user.service';
import {CreateUserDto, CreateUserResponseDto} from './dto/create-user.dto';
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiResponse,
    ApiTags
} from "@nestjs/swagger";
import {getBadRequestErrors, getUnauthorizedError} from "../utils/getErrors"
import {GetUserResponseDto} from "./dto/get-user.dto";
import {DeleteUserDto} from "./dto/delete-user.dto";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @ApiTags('auth')
    @ApiOperation({summary: "Регистрация нового пользователя"})
    @ApiBody({type: CreateUserDto})
    @ApiCreatedResponse({description: 'Пользователь успешно создан.', type: CreateUserResponseDto})
    @ApiResponse(getBadRequestErrors("Неверные данные", [
        {error: "This email already exist!", description: "Почта уже существует"},
        {error: "This login already exist!", description: "Логин уже существует"}
    ]))
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @ApiTags('user')
    @ApiOperation({summary: "Получение профиля пользователя"})
    @ApiOkResponse({description: "Профиль успешно получен", type: GetUserResponseDto})
    @ApiResponse(getBadRequestErrors("Неверные данные", [
        {error: "The user is not found!", description: "Пользователь не найден"},
    ]))
    @ApiResponse(getUnauthorizedError())
    @ApiBearerAuth()
    @Get('/')
    @UseGuards(JwtAuthGuard)
    findOneByAccessToken(@Req() req) {
        return this.userService.findOneById(req.user.id);
    }

    @ApiTags('user')
    @ApiOperation({summary: "Удаление пользователя"})
    @ApiOkResponse({description: "Пользователь успешно удалён"})
    @ApiResponse(getBadRequestErrors("Неверные данные", [
        {error: "The user is not found!", description: "Пользователь не найден"},
    ]))
    @ApiResponse({
        status: 401,
        description: "Не авторизован",
        content: {
            'application/json': {
                examples: {
                    "Не авторизован": {
                        value: {
                            "message": "Unauthorized",
                            "statusCode": 401
                        }
                    },
                    "Вы не владелец аккаунта": {
                        value: {
                            "message": "You cannot delete another user!",
                            "statusCode": 401
                        }
                    },

                }
            }
        }
    })
    @ApiBearerAuth()
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param() deleteUserDto: DeleteUserDto, @Req() req) {
        return this.userService.remove(deleteUserDto.id, req.user.id);
    }
}
