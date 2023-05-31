import { createAsyncThunk } from '@reduxjs/toolkit';

import { API_URL } from '../../config';
import { ErrorService } from '../../lib';
import { GeneralSettingResponseDto } from '../../response-dto/setting/general-setting.response-dto';

export const preloadGeneral = createAsyncThunk('general/preload', async () => {
  return new GeneralSettingResponseDto(
    await fetch(`${API_URL}/setting/general`).then(
      (res) => (ErrorService.validate(res), res.json()),
    ),
  );
});
