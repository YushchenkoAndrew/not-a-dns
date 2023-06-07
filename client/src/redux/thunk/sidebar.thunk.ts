import { createAsyncThunk } from '@reduxjs/toolkit';

import { API_URL } from '../../config';
import { ErrorService } from '../../lib';
import { AliasPageResponseDto } from '../../response-dto/alias/alias-page-response.dto';

export const preloadSidebar = createAsyncThunk('sidebar/preload', async () => {
  return {
    alias: await fetch(`${API_URL}/alias?order_by=updated_at`)
      .then((res) => (ErrorService.validate(res), res.json()))
      .then((res) => new AliasPageResponseDto().build(res)),
  };
});
