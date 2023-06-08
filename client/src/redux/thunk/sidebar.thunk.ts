import { createAsyncThunk } from '@reduxjs/toolkit';

import { API_URL } from '../../config';
import { AliasPageEntity } from '../../entities/alias/alias-page.entity';
import { ErrorService } from '../../lib';

export const preloadSidebar = createAsyncThunk('sidebar/preload', async () => {
  return {
    alias: await fetch(`${API_URL}/alias?order_by=updated_at`)
      .then((res) => (ErrorService.validate(res), res.json()))
      .then((res) => new AliasPageEntity().build(res)),
  };
});
