import { createAsyncThunk } from '@reduxjs/toolkit';

import { API_URL } from '../../config';
import { AliasPageEntity } from '../../entities/alias/alias-page.entity';
import { ErrorService, StringService } from '../../lib';

export const preloadNavbar = createAsyncThunk('navbar/preload', async () => {
  return new AliasPageEntity().build(
    await fetch(
      // TODO: Add RequestDto
      `${API_URL}/alias?${StringService.toQuery({
        favorite: true,
        view: 'final',
      })}`,
    ).then((res) => (ErrorService.validate(res), res.json())),
  );
});
