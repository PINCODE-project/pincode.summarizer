import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post, Query,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {RecordService} from './record.service';
import {UpdateRecordDto} from './dto/update-record.dto';
import {getMulterOptions} from "./multer.config";
import {FileInterceptor} from "@nestjs/platform-express";
import {UploadFileDto} from "./dto/upload-file.dto";
import {ApiBearerAuth, ApiConsumes, ApiResponse, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {getUnauthorizedError} from "../utils/getErrors";

@ApiTags("record")
@Controller('record')
export class RecordController {
    constructor(private readonly recordService: RecordService) {
    }

    @UseInterceptors(FileInterceptor(
        'file',
        getMulterOptions('./static/uploads', 1024 * 1024 * 1024, /(audio\/mpeg)$/)
    ))
    @ApiConsumes('multipart/form-data')
    @ApiResponse(getUnauthorizedError())
    @ApiBearerAuth()
    @Post("upload")
    @UseGuards(JwtAuthGuard)
    uploadFile(
        @Body() uploadFileDto: UploadFileDto,
        @UploadedFile() file: Express.Multer.File,
        @Req() req
    ) {
        return this.recordService.upload(file, req.user.id);
    }

    @ApiResponse(getUnauthorizedError())
    @ApiBearerAuth()
    @Post("transcribe/:id")
    @UseGuards(JwtAuthGuard)
    transcribe(@Param("id") id: string) {
        return this.recordService.transcribe(id);
    }

    @ApiResponse(getUnauthorizedError())
    @ApiBearerAuth()
    @Post("summarize/:id")
    @UseGuards(JwtAuthGuard)
    summarize(@Param("id") id: string) {
        return this.recordService.summarize(id);
    }


    @ApiResponse(getUnauthorizedError())
    @ApiBearerAuth()
    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(@Req() req) {
        return this.recordService.findAll(req.user.id);
    }

    @ApiResponse(getUnauthorizedError())
    @ApiBearerAuth()
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id') id: string, @Req() req) {
        return this.recordService.findOne(id, req.user.id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateRecordDto: UpdateRecordDto) {
        return this.recordService.update(+id, updateRecordDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.recordService.remove(+id);
    }
}
