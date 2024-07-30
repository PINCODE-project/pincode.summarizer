import {extname} from 'path';
import {existsSync, mkdirSync} from 'fs';
import {diskStorage} from 'multer';
import {v4 as uuid} from 'uuid';
import {HttpException, HttpStatus} from '@nestjs/common';

export const getMulterOptions = (dest: string, fileSize: number, types: RegExp) => ({
    limits: {fileSize},
    fileFilter: (req: any, file: any, cb: any) => {
        console.log(req, file, cb)
        if (!file.mimetype.match(types)) {
            cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
        }
        else {
            cb(null, true)
        }
    },
    storage: diskStorage({
        destination: (req: any, file: any, cb: any) => {
            if (!existsSync(dest))
                mkdirSync(dest);
            cb(null, dest);
        },
        filename: (req: any, file: any, cb: any) => {
            cb(null, `${uuid()}${extname(file.originalname)}`);
        },
    }),
});
