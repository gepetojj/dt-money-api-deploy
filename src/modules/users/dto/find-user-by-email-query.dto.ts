import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class FindUserByEmailQueryDto {
  @ApiProperty({
    description: 'E-mail do usuário a ser buscado',
    example: 'joao@example.com',
  })
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  email: string;
}
