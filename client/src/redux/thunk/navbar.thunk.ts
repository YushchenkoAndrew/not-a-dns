import { createAsyncThunk } from '@reduxjs/toolkit';

import { API_URL } from '../../config';
import { NavbarSettingResponseDto } from '../../response-dto/setting/navbar-setting.response-dto';

export const preloadNavbar = createAsyncThunk('navbar/preload', async () => {
  return new NavbarSettingResponseDto(
    // FIXME: Change TO /alias?favorite
    await fetch(`${API_URL}/setting/navbar`).then((res) => res.json()),
  );
});
