import { serialize } from 'cookie';

import type { RequestHandler } from "@sveltejs/kit";

// POST /dns/mode
export const post: RequestHandler = async ({ request }) => {
  return {
    headers: {
      "Set-Cookie": serialize(
        "mode",
        (Number(await request.text()) || 0) + "",
        { path: "/", httpOnly: true }
      ),
    },
  };
};
