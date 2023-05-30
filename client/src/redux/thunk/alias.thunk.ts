import { createAsyncThunk } from '@reduxjs/toolkit';

import { API_URL } from '../../config';
import { AliasEntity } from '../../entities/alias.entity';
import { StringService } from '../../lib';
import { AliasPageResponseDto } from '../../response-dto/alias-page.response-dto';
import { CommonResponseDto } from '../../response-dto/common.response-dto';
import { AliasStoreT } from '../reducer/alias.reducer';

export const loadAlias = createAsyncThunk(
  'alias/load',
  async (query?: AliasStoreT['query']) => {
    return {
      options: query,
      res: new AliasPageResponseDto(
        await fetch(`${API_URL}/alias?${StringService.toQuery(query)}`).then(
          (res) => res.json(),
        ),
      ),
    };
  },
);

export const upsertAlias = createAsyncThunk(
  'alias/upsert',
  async ({ body, id }: { body: AliasEntity; id?: string }) => {
    return CommonResponseDto.assign(
      await fetch(`${API_URL}/alias${id ? '' : `/${id}`}`, {
        mode: 'cors',
        method: id ? 'POST' : 'PUT',
        body: JSON.stringify(CommonResponseDto.assign(body, new AliasEntity())),
        headers: { 'Content-Type': 'application/json' },
      }).then((res) => res.json()),
      new AliasEntity(),
    );
  },
);

export const deleteAlias = createAsyncThunk(
  'alias/delete',
  async (id: string) => {
    return CommonResponseDto.assign(
      await fetch(`${API_URL}/alias/${id}`, {
        method: 'DELETE',
      }).then((res) => res.json()),
      new AliasEntity(),
    );
  },
);
