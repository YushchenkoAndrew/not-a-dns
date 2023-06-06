import { createAsyncThunk } from '@reduxjs/toolkit';

import { API_URL } from '../../config';
import { ErrorService, StringService } from '../../lib';
import { AliasPageResponseDto } from '../../response-dto/alias/alias-page-response.dto';

export const preloadNavbar = createAsyncThunk('navbar/preload', async () => {
  return new AliasPageResponseDto().build(
    await fetch(
      // TODO: Add RequestDto
      `${API_URL}/alias?${StringService.toQuery({
        favorite: true,
        view: 'final',
      })}`,
    ).then((res) => (ErrorService.validate(res), res.json())),
  );
});
