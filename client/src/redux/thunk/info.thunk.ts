import { createAsyncThunk } from '@reduxjs/toolkit';

import { API_URL } from '../../config';
import { ErrorService } from '../../lib';
import { InfoResponseDto } from '../../response-dto/info.response-dto';

export const getInfo = createAsyncThunk('info/load', async (id: string) => {
  return new InfoResponseDto(
    await fetch(`${API_URL}/info/${id}`).then(
      (res) => (ErrorService.validate(res), res.json()),
    ),
  );
});
