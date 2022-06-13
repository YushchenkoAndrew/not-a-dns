import { parse, serialize } from 'cookie';

import { AppMode } from '../../types';

import type { RequestHandler } from "@sveltejs/kit";

export const post: RequestHandler = async ({ request }) => {
  const cookies = parse(request.headers.get("cookie") || "");
  if (!cookies.userid) return { status: 400 };

  return {
    headers: {
      "set-cookie": serialize(
        "mode",
        `${Number(await request.text()) || AppMode.light}`,
        { path: "/", httpOnly: true }
      ),
    },
  };
};
