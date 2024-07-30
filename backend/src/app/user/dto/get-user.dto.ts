import {IsEmail, IsString, MaxLength, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class GetUserResponseDto {
    @ApiProperty({description: "Логин", example: "CatDev"})
    login: string;

    @ApiProperty({description: "Почта", example: "r.maximka@mail.ru"})
    email: string;

    @ApiProperty({description: "Имя", example: "Максим"})
    firstName: string;

    @ApiProperty({description: "Фамилия", example: "Рожков"})
    secondName: string;

    @ApiProperty({description: "Пароль", example: "P@ssw0rd"})
    password: string;
}


export class CreateUserResponseDto {
    @ApiProperty({description: "ID созданного пользователя", example: "1bd493a0-8f65-4204-84af-c16184f85342x"})
    userId: string;
}
