import { createAsyncThunk } from '@reduxjs/toolkit';

import { API_URL } from '../../config';
import { StringService } from '../../lib';
import { HostPageResponseDto } from '../../response-dto/host-page.response-dto';
import { PageType } from '../../types/page.type';

export const loadHostRecords = createAsyncThunk(
  'host/preload',
  async (options?: PageType) => {
    return new HostPageResponseDto(
      await fetch(`${API_URL}/hosts?${StringService.toQuery(options)}`).then(
        (res) => res.json(),
      ),
    );
  },
);
