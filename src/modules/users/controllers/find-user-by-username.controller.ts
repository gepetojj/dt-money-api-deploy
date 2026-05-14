import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FindUserByUsernameQueryDto } from '../dto/find-user-by-username-query.dto';
import { FindUserByUsernameService } from '../services/find-user-by-username.service';

@ApiTags('users')
@Controller('users')
export class FindUserByUsernameController {
  constructor(
    private readonly findUserByUsernameService: FindUserByUsernameService,
  ) {}

  @Get('by-username')
  @ApiOperation({ summary: 'Buscar usuário por nome de usuário (login)' })
  @ApiQuery({ name: 'username', type: String, example: 'joaosilva' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Usuário encontrado.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Parâmetros inválidos.',
  })
  async handle(
    @Query() query: FindUserByUsernameQueryDto,
    @Res() res: Response,
  ) {
    const user = await this.findUserByUsernameService.execute(query.username);
    return res.status(HttpStatus.OK).json(user);
  }
}
