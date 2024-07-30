import {IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({description: "Логин", example: "CatDev"})
    @IsString()
    login: string;

    @ApiProperty({description: "Пароль", example: "P@ssw0rd"})
    password: string;
}

export class LoginResponseDto {
    @ApiProperty({description: "ID пользователя", example: "1bd493a0-8f65-4204-84af-c16184f85342"})
    @IsString()
    id: string;

    @ApiProperty({description: "Логин", example: "CatDev"})
    @IsString()
    login: string;

    @ApiProperty({
        description: "Токен авторизации",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6IkNhdERldiIsImlkIjoiMWJkNDkzYTAtOGY2NS00MjA0LTg0YWYtYzE2MTg0Zjg1MzQyIiwiaWF0IjoxNzE4MzkyOTM3LCJleHAiOjE3MjA5ODQ5Mzd9.FtvFir-R2ljIEIvVrDk4G3IdCX2tdq5xHlzSXgf1pzI"
    })
    @IsString()
    accessToken: string;
}


export class LoginUnauthorizedDto {
    @ApiProperty({description: "Описание ошибки", example: "Login or password are incorrect!"})
    @IsString()
    message: string;

    @ApiProperty({description: "Ошибка", example: "Unauthorized"})
    @IsString()
    error: string;

    @ApiProperty({description: "Код ошибки", example: "401"})
    @IsString()
    statusCode: number;
}
