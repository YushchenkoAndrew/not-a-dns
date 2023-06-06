import { createAsyncThunk } from '@reduxjs/toolkit';

import { API_URL } from '../../config';
import { ErrorService, StringService } from '../../lib';
import { AliasPageResponseDto } from '../../response-dto/alias/alias-page-response.dto';
import { AliasResponseDto } from '../../response-dto/alias/alias-response.dto';
import { AliasStoreT } from '../reducer/alias.reducer';

export const loadAlias = createAsyncThunk(
  'alias/load',
  async (query?: AliasStoreT['query']) => {
    return {
      options: query,
      res: new AliasPageResponseDto().build(
        await fetch(`${API_URL}/alias?${StringService.toQuery(query)}`).then(
          (res) => (ErrorService.validate(res), res.json()),
        ),
      ),
    };
  },
);

export const upsertAlias = createAsyncThunk(
  'alias/upsert',
  async ({ body, id }: { body: AliasResponseDto; id?: string }) => {
    return new AliasResponseDto().build(
      await fetch(`${API_URL}/alias${id ? '' : `/${id}`}`, {
        mode: 'cors',
        method: id ? 'POST' : 'PUT',
        body: JSON.stringify(new AliasResponseDto().build(body)),
        headers: { 'Content-Type': 'application/json' },
      }).then((res) => (ErrorService.validate(res), res.json())),
    );
  },
);

export const deleteAlias = createAsyncThunk(
  'alias/delete',
  async (id: string) => {
    return new AliasResponseDto().build(
      await fetch(`${API_URL}/alias/${id}`, {
        method: 'DELETE',
      }).then((res) => (ErrorService.validate(res), res.json())),
    );
  },
);
