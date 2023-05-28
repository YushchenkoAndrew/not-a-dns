import { createAsyncThunk } from '@reduxjs/toolkit';

import { API_URL } from '../../config';
import { StringService } from '../../lib';
import { HostPageResponseDto } from '../../response-dto/host-page.response-dto';
import { LinkStoreT } from '../reducer/link-record.reducer';

export const loadLinkRecords = createAsyncThunk(
  'host/preload',
  async (options?: LinkStoreT['options']) => {
    return {
      options,
      res: new HostPageResponseDto(
        await fetch(`${API_URL}/links?${StringService.toQuery(options)}`).then(
          (res) => res.json(),
        ),
      ),
    };
  },
);
