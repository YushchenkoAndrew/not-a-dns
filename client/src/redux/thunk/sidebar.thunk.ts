import { createAsyncThunk } from '@reduxjs/toolkit';

import { API_URL } from '../../config';
import { ErrorService } from '../../lib';
import { SidebarSettingResponseDto } from '../../response-dto/setting/sidebar-setting.response-dto';

export const preloadSidebar = createAsyncThunk('sidebar/preload', async () => {
  return new SidebarSettingResponseDto(
    // FIXME: Change TO /alias?favorite
    await fetch(`${API_URL}/setting/sidebar`).then(
      (res) => (ErrorService.validate(res), res.json()),
    ),
  );
});
