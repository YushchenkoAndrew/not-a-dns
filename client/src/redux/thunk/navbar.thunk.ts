import { createAsyncThunk } from '@reduxjs/toolkit';

import { API_URL } from '../../config';
import { ErrorService } from '../../lib';
import { NavbarSettingResponseDto } from '../../response-dto/setting/navbar-setting.response-dto';

export const preloadNavbar = createAsyncThunk('navbar/preload', async () => {
  return new NavbarSettingResponseDto(
    // FIXME: Change TO /alias?favorite
    await fetch(`${API_URL}/setting/navbar`).then(
      (res) => (ErrorService.validate(res), res.json()),
    ),
  );
});
