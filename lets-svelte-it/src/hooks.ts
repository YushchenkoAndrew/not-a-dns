import { v4 as uuid } from '@lukeed/uuid';
import { parse, serialize } from 'cookie';

import { AppMode } from './types';

import type { Handle, RequestEvent } from "@sveltejs/kit";
export const handle: Handle = async ({ event, resolve }) => {
  const cookies = parse(event.request.headers.get("cookie") || "");
  event.locals.userid = cookies.userid || uuid();
  event.locals.mode = Number(cookies.mode) || AppMode.light;

  const response = await resolve(event);
  if (cookies.userid) return response;

  // if this is the first time the user has visited this app,
  // set a cookie so that we recognise them when they return
  response.headers.append(
    "set-cookie",
    serialize("userid", event.locals.userid, { path: "/", httpOnly: true })
  );

  response.headers.append(
    "set-cookie",
    serialize("mode", `${event.locals.mode}`, { path: "/", httpOnly: true })
  );

  return response;
};

export function getSession({ locals }: RequestEvent) {
  return { mode: locals.mode };
}
