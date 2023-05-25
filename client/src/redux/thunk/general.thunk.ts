import { createAsyncThunk } from '@reduxjs/toolkit';

import { API_URL } from '../../config';
import { GeneralSettingResponseDto } from '../../response-dto/setting/general-setting.response-dto';

export const preloadGeneral = createAsyncThunk('general/preload', async () => {
  return new GeneralSettingResponseDto(
    await fetch(`${API_URL}/setting/general`).then((res) => res.json()),
  );
});
