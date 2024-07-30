import {ApiProperty} from "@nestjs/swagger";

export class DeleteUserDto {
    @ApiProperty({description: "ID пользователя", example: "ca1962c1-9011-47a1-95b6-a074baa8f8d1"})
    id: string;
}
