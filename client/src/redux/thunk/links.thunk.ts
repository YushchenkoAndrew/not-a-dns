import { createAsyncThunk } from '@reduxjs/toolkit';

import { API_URL } from '../../config';
import { StringService } from '../../lib';
import { AliasPageResponseDto } from '../../response-dto/alias-page.response-dto';
import { LinkStoreT } from '../reducer/links.reducer';

export const loadLinks = createAsyncThunk(
  'links/preload',
  async (options?: LinkStoreT['options']) => {
    return {
      options,
      res: new AliasPageResponseDto(
        await fetch(`${API_URL}/links?${StringService.toQuery(options)}`).then(
          (res) => res.json(),
        ),
      ),
    };
  },
);
