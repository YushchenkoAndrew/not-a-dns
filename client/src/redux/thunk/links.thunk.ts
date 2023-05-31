import { createAsyncThunk } from '@reduxjs/toolkit';

import { API_URL } from '../../config';
import { LinksEntity } from '../../entities/links.entity';
import { ErrorService, StringService } from '../../lib';
import { CommonResponseDto } from '../../response-dto/common.response-dto';
import { LinksPageResponseDto } from '../../response-dto/links-page.response-dto';
import { LinkStoreT } from '../reducer/links.reducer';

export const loadLinks = createAsyncThunk(
  'links/preload',
  async (options?: LinkStoreT['query']) => {
    return {
      options,
      res: new LinksPageResponseDto(
        await fetch(`${API_URL}/links?${StringService.toQuery(options)}`).then(
          (res) => (ErrorService.validate(res), res.json()),
        ),
      ),
    };
  },
);

export const upsertLinks = createAsyncThunk(
  'links/upsert',
  async ({ body, id }: { body: LinksEntity; id?: string }) => {
    return CommonResponseDto.assign(
      await fetch(`${API_URL}/links${id ? '' : `/${id}`}`, {
        mode: 'cors',
        method: id ? 'POST' : 'PUT',
        body: JSON.stringify(CommonResponseDto.assign(body, new LinksEntity())),
        headers: { 'Content-Type': 'application/json' },
      }).then((res) => (ErrorService.validate(res), res.json())),
      new LinksEntity(),
    );
  },
);

export const deleteLinks = createAsyncThunk(
  'links/delete',
  async (id: string) => {
    return CommonResponseDto.assign(
      await fetch(`${API_URL}/links/${id}`, {
        method: 'DELETE',
      }).then((res) => (ErrorService.validate(res), res.json())),
      new LinksEntity(),
    );
  },
);
