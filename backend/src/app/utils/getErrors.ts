interface Error {
    error: string;
    description: string;
}

export function getBadRequestErrors(description: string, errors: Error[]) {
    const parsedErrors = {}
    errors.forEach((error) => {
        parsedErrors[error.description] = {
            value: {
                "message": error.error,
                "error": "Bad Request",
                "statusCode": 400
            }
        }
    })
    return {
        status: 400,
        description: "Неверные данные",
        content: {
            'application/json': {
                examples: parsedErrors
            }
        }
    }
}

export function getUnauthorizedError() {
    return {
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
                    }
                }
            }
        }
    }
}

