import {SwaggerTag} from './swagger-tags.interface';

export const _SWAGGER_TAGS: SwaggerTag[] = [
    {
        name: 'auth',
        description: 'Эндпоинты для авторизации',
    },
    {
        name: 'user',
        description: 'Эндпоинты для работы с данными пользователя',
    },
    {
        name: 'record',
        description: 'Эндпоинты для работы с записями созвонов'
    }
];
