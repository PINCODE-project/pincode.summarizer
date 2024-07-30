import {BadRequestException, ForbiddenException, Injectable} from '@nestjs/common';
import {UpdateRecordDto} from './dto/update-record.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Record} from "./entities/record.entity";
import {Repository} from "typeorm";
import axios from "axios";
import * as fs from 'fs';

import * as FormData from "form-data";

@Injectable()
export class RecordService {
    constructor(
        @InjectRepository(Record)
        private readonly recordRepository: Repository<Record>
    ) {
    }

    async upload(file: Express.Multer.File, userId: string) {
        const newRecord = {
            name: file.filename,
            fileName: file.filename,
            user: {id: userId}
        };
        console.log(newRecord)

        const res = await this.recordRepository.save(newRecord);
        return {recordID: res.id}
    }

    async transcribe(recordId: string) {
        const record = await this.recordRepository.findOne({
            where: {
                id: recordId
            }
        })

        let data = new FormData();
        const filePath = `./static/uploads/${record.fileName}`;

        try {
            if (!fs.existsSync(filePath)) {
                throw new Error(`File not found: ${filePath}`);
            }

            data.append('audio', fs.createReadStream(filePath));

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://pincode-dev.ru/ai-api/transcribe',
                headers: {
                    'accept': 'multipart/form-data',
                    ...data.getHeaders()
                },
                data: data
            };

            await this.recordRepository.update(record.id, {
                status: "Transcribing"
            })

            const recognitionText = await axios.request(config);

            await this.recordRepository.update(record.id, {
                transcription: JSON.stringify(recognitionText.data),
                status: "Transcribed"
            })
            console.log('Response:', recognitionText.data);
        } catch (error) {
            console.error('Error:', error.message || error);
        }
    }


    async summarize(recordId: string) {
        const record = await this.recordRepository.findOne({
            where: {
                id: recordId
            }
        })

        if (!record.transcription)
            throw new BadRequestException("The record doesn't transcribe")

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://pincode-dev.ru/ai-api/summarize',
            data: {
                text: JSON.parse(record.transcription || "[]"),
                parts: [
                    "Участники",
                    "Основные темы диалога",
                    "Заметки",
                    "Договоренности и задачи",
                    "Краткое содержание беседы"
                ]
            }
        };

        await this.recordRepository.update(record.id, {
            status: "Summarizing"
        })

        const summarizedText = await axios.request(config);

        await this.recordRepository.update(record.id, {
            summarization: JSON.stringify(summarizedText.data),
            status: "Summarized"
        })
    }

    async findAll(userId: string) {
        return await this.recordRepository.find({
            where: {
                user: {id: userId},
            },
            order: {
                updatedAt: "DESC"
            }
        });
    }

    async findOne(id: string, userId: string) {
        const record = await this.recordRepository.findOne({
            where: {id},
            relations: {
                user: true
            }
        });

        if (!record)
            throw new BadRequestException("The record doesn't found!")

        if(record.user.id !== userId)
            throw new ForbiddenException("You haven't access to this record!")


        // console.log(record)
        return {
            ...record,
            transcription: record.transcription ? JSON.parse(record.transcription || "[]") : null,
            summarization: record.summarization ? JSON.parse(record.summarization || "[]") : null
        }
    }

    update(id: number, updateRecordDto: UpdateRecordDto) {
        return `This action updates a #${id} record`;
    }

    remove(id: number) {
        return `This action removes a #${id} record`;
    }
}
