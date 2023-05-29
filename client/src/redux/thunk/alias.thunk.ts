import { createAsyncThunk } from '@reduxjs/toolkit';

import { API_URL } from '../../config';
import { StringService } from '../../lib';
import { AliasPageResponseDto } from '../../response-dto/alias-page.response-dto';
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
