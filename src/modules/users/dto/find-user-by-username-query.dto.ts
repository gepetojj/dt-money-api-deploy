import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class FindUserByUsernameQueryDto {
  @ApiProperty({
    description: 'Nome de usuário a ser buscado',
    example: 'joaosilva',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;
}
