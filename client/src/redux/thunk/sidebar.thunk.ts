import { createAsyncThunk } from '@reduxjs/toolkit';

import { API_URL } from '../../config';
import { SidebarSettingResponseDto } from '../../response-dto/setting/sidebar-setting.response-dto';

export const preloadSidebar = createAsyncThunk('sidebar/preload', async () => {
  return new SidebarSettingResponseDto(
    await fetch(`${API_URL}/setting/sidebar`).then((res) => res.json()),
  );
});
