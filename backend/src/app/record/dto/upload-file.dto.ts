import {ApiProperty} from "@nestjs/swagger";

export class UploadFileDto {
    @ApiProperty({ type: 'string', format: 'binary', required: true, description: "Файл записи созвона" })
    file: Express.Multer.File
}
