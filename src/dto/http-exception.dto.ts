import { ApiProperty } from '@nestjs/swagger';

export abstract class HttpExceptionExample {
   @ApiProperty({description: 'Код статуса ответа', example: 400})
   public readonly statusCode!: number;

   @ApiProperty({description: 'Описание ошибки', example: 'Некорректный запрос'})
   public readonly message!: string;

   @ApiProperty({description: 'Стандартное описание статуса ответ', example: 'Bad Request'})
   public readonly error!: string;
}
