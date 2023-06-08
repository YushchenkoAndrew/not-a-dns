import { createAsyncThunk } from '@reduxjs/toolkit';

import { API_URL } from '../../config';
import { AliasPageResponseDto } from '../../entities/alias/alias-page-response.dto';
import { CommonEntity } from '../../entities/common.entity';
import { ErrorService, StringService } from '../../lib';
import { AliasStoreT } from '../reducer/alias.reducer';

export const loadAlias = createAsyncThunk(
  'alias/load',
  async (query?: AliasStoreT['query']) => {
    return {
      options: query,
      res: new AliasPageResponseDto().build(
        await fetch(`${API_URL}/alias?${StringService.toQuery(query)}`).then(
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

// export const upsertAlias = createAsyncThunk(
//   'alias/upsert',
//   async ({ body, id }: { body: AliasEntity; id?: string }) => {
//     return new AliasEntity().build(
//       await fetch(`${API_URL}/alias${id ? '' : `/${id}`}`, {
//         method: id ? 'POST' : 'PUT',
//         body: JSON.stringify(new AliasEntity().build(body)),
//         headers: { 'Content-Type': 'application/json' },
//       }).then((res) => (ErrorService.validate(res), res.json())),
//     );
//   },
// );

// export const deleteAlias = createAsyncThunk(
//   'alias/delete',
//   async (id: string) => {
//     return new AliasEntity().build(
//       await fetch(`${API_URL}/alias/${id}`, {
//         method: 'DELETE',
//       }).then((res) => (ErrorService.validate(res), res.json())),
//     );
//   },
// );
