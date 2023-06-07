import { createAsyncThunk } from '@reduxjs/toolkit';

import { API_URL } from '../../config';
import { ErrorService } from '../../lib';
import { SettingResponseDto } from '../../response-dto/setting/general-setting.response-dto';

export const preloadGeneral = createAsyncThunk('general/preload', async () => {
  return new SettingResponseDto().build(
    await fetch(`${API_URL}/setting/default`).then(
      (res) => (ErrorService.validate(res), res.json()),
    ),
  );
});

export const invertMode = createAsyncThunk(
  'general/invert_mode',
  async (body: SettingResponseDto) => {
    return new SettingResponseDto().build(
      await fetch(`${API_URL}/setting/default`, {
        method: 'PUT',
        body: JSON.stringify(
          new SettingResponseDto().build({ ...body, mode: !body.mode }),
        ),
        headers: { 'Content-Type': 'application/json' },
      }).then((res) => (ErrorService.validate(res), res.json())),
    );
  },
);
