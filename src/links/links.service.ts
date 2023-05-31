import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LinksEntity } from './entities/links.entity';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(LinksEntity)
    public readonly linksRepository: Repository<LinksEntity>,
  ) {}

  getAll(options: unknown): Promise<unknown> {
    return null;
  }

  getOne(id: string): Promise<unknown> {
    return null;
  }

  upsertLinks(body: unknown, id?: string): Promise<unknown> {
    return null;
  }

  deleteLinks(id: string): Promise<unknown> {
    return null;
  }
}
