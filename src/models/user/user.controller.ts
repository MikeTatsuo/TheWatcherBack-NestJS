import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';

import { UserService } from '@/models/user/user.service';
import { UserEntity } from '@/models/user/entities/user.entity';
import { UserDTO } from '@/models/user/interfaces/user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'per_page', required: false, type: 'number' })
  @ApiQuery({ name: 'order_by', required: false, type: 'string' })
  @ApiQuery({ name: 'order', required: false, type: '"ASC" | "DESC"' })
  getAll(@Query() paginationOptions: PaginationOptionsDTO): Promise<PaginationDTO<UserEntity>> {
    return this.userService.getAll(paginationOptions);
  }

  @Get('by_id/:user_id')
  @ApiParam({ name: 'user_id', required: true, type: 'number' })
  getById(@Param('user_id') user_id: number): Promise<UserEntity> {
    return this.userService.getById(user_id);
  }

  @Get('by_username/:username')
  @ApiParam({ name: 'username', required: true, type: 'string' })
  getByUsername(@Param('username') username: string): Promise<UserEntity> {
    return this.userService.getByUsername(username);
  }

  @Post()
  @ApiBody({ required: true, type: UserDTO })
  createUser(@Body() user: Partial<UserDTO>): Promise<UserEntity> {
    return this.userService.create(user);
  }

  @Put(':user_id')
  @ApiBody({ required: true, type: UserDTO })
  @ApiParam({ name: 'user_id', required: true, type: 'number' })
  updateUser(@Param() user_id: number, @Body() user: Partial<UserDTO>) {
    return this.userService.update(user_id, user);
  }

  @Patch(':user_id')
  @ApiBody({ required: true, type: UserDTO })
  @ApiParam({ name: 'user_id', required: true, type: 'number' })
  partialUpdateUser(@Param() user_id: number, @Body() user: Partial<UserDTO>) {
    return this.userService.update(user_id, user);
  }

  @Delete(':user_id')
  @ApiQuery({ name: 'user_id', required: true, type: 'number' })
  deleteUser(@Query('user_id') user_id: number): Promise<number> {
    return this.userService.delete(user_id);
  }
}
