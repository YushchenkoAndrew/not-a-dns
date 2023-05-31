import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AliasEntity } from './entities/alias.entity';

@Injectable()
export class AliasService {
  constructor(
    @InjectRepository(AliasEntity)
    public readonly aliasRepository: Repository<AliasEntity>,
  ) {}

  getAll(options: unknown): Promise<unknown> {
    return null;
  }

  getOne(id: string): Promise<unknown> {
    return null;
  }

  upsertAlias(body: unknown, id?: string): Promise<unknown> {
    return null;
  }

  deleteAlias(id: string): Promise<unknown> {
    return null;
  }
}
