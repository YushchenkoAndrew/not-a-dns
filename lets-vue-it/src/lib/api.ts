import { DNS_API } from '../config';

import type { DefaultResponse, ObjectLiteral, RecordTableType } from "../types";

export async function loadRecord(): Promise<ObjectLiteral[]> {
  const res = await fetch(`${DNS_API}/dns/api`, { method: "GET" });
  const body = (await res.json()) as DefaultResponse;
  console.log(body);

  return body.status === "OK" ? body.result : [];
}

export async function saveRecord(
  data: ObjectLiteral,
  origin: ObjectLiteral | null
): Promise<DefaultResponse> {
  const res = await fetch(`${DNS_API}/dns/api`, {
    headers: { "Content-Type": "application/json" },

    ...(origin
      ? { method: "PUT", body: JSON.stringify({ old: origin, new: data }) }
      : { method: "POST", body: JSON.stringify(data) }),
  });

  return (await res.json()) as DefaultResponse;
}
