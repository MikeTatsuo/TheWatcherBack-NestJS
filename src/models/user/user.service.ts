import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationDTO } from '@/common/dtos/pagination.dto';
import { PaginationOptionsDTO } from '@/common/dtos/pagination_options.dto';

import { UserEntity } from '@/models/user/entities/user.entity';
import { UserDTO } from '@/models/user/interfaces/user.dto';

@Injectable()
export class UserService {
  private readonly userRepository: Repository<UserEntity>;

  constructor(
    @InjectRepository(UserEntity)
    userRepository: Repository<UserEntity>,
  ) {
    this.userRepository = userRepository;
  }

  async getAll(paginationOptions: PaginationOptionsDTO): Promise<PaginationDTO<UserEntity>> {
    return new Promise((resolve, reject) => {
      const { per_page, skip, order, order_by } = paginationOptions;

      this.userRepository
        .find({
          take: per_page,
          skip,
          order: { [order_by]: order },
        })
        .then((entities) => {
          const queryBuilder = this.userRepository.createQueryBuilder('operation_type');
          return Promise.all([queryBuilder.getCount(), Promise.resolve(entities)]);
        })
        .then(([total, entities]) => {
          resolve(new PaginationDTO(entities, { total, paginationOptions }));
        })
        .catch(reject);
    });
  }

  async getById(id: number): Promise<UserEntity> {
    return this.userRepository.findOneBy({ id });
  }

  async getByUsername(username: string): Promise<UserEntity> {
    return this.userRepository.findOneBy({ username });
  }

  async create(user: Partial<UserDTO>): Promise<UserEntity> {
    return this.userRepository.save(user);
  }

  async update(id: number, user: Partial<UserDTO> | UserDTO): Promise<UserEntity> {
    return this.userRepository.save({ id, ...user });
  }

  async delete(id: number): Promise<number> {
    return new Promise((resolve) => {
      this.userRepository.softDelete(id).then((response) => {
        resolve(response.affected);
      });
    });
  }
}
