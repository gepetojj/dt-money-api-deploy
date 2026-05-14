import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindUserByEmailQueryDto } from '../dto/find-user-by-email-query.dto';
import { FindUserByEmailService } from '../services/find-user-by-email.service';

@ApiTags('users')
@Controller('users')
export class FindUserByEmailController {
  constructor(
    private readonly findUserByEmailService: FindUserByEmailService,
  ) {}

  @Get('by-email')
  @ApiOperation({ summary: 'Buscar usuário por e-mail' })
  @ApiQuery({ name: 'email', type: String, example: 'joao@example.com' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Usuário encontrado.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'E-mail inválido.',
  })
  async handle(@Query() query: FindUserByEmailQueryDto, @Res() res: Response) {
    const user = await this.findUserByEmailService.execute(query.email);
    return res.status(HttpStatus.OK).json(user);
  }
}
