import { createAsyncThunk } from '@reduxjs/toolkit';

import { API_URL } from '../../config';
import { CommonEntity } from '../../entities/common.entity';
import { LinksPageResponseDto } from '../../entities/links/links-page-response.dto';
import { ErrorService, StringService } from '../../lib';
import { LinkStoreT } from '../reducer/links.reducer';

export const loadLinks = createAsyncThunk(
  'links/preload',
  async (options?: LinkStoreT['query']) => {
    return {
      options,
      res: new LinksPageResponseDto().build(
        await fetch(`${API_URL}/links?${StringService.toQuery(options)}`).then(
          (res) => (ErrorService.validate(res), res.json()),
        ),
      ),
    };
  },
);

/**
 * NOTE: For more info checkout
 * @see {@link CommonEntity#findOne}
 */

// export const upsertLinks = createAsyncThunk(
//   'links/upsert',
//   async ({ body, id }: { body: LinksResponseDto; id?: string }) => {
//     return new LinksResponseDto().build(
//       await fetch(`${API_URL}/links${id ? '' : `/${id}`}`, {
//         method: id ? 'POST' : 'PUT',
//         body: JSON.stringify(new LinksResponseDto().build(body)),
//         headers: { 'Content-Type': 'application/json' },
//       }).then((res) => (ErrorService.validate(res), res.json())),
//     );
//   },
// );

// export const deleteLinks = createAsyncThunk(
//   'links/delete',
//   async (id: string) => {
//     return new LinksResponseDto().build(
//       await fetch(`${API_URL}/links/${id}`, {
//         method: 'DELETE',
//       }).then((res) => (ErrorService.validate(res), res.json())),
//     );
//   },
// );
