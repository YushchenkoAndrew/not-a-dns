import { parse } from 'cookie';

import type { RequestHandler } from "@sveltejs/kit";

export const post: RequestHandler = async ({ request }) => {
  const cookies = parse(request.headers.get("cookie") || "");
  if (!cookies.userid) return { status: 400 };

  console.log(await request.json());

  // const body

  return {
    status: 201,
    body: {
      result: [
        {
          name: "A Records",
          keys: ["record", "name", "value", "ttl"],
          values: [
            ["example.com", "@", "192.168.1.2", 14400],
            ["example.com", "@", "192.168.1.3", 14400],
          ],
        },
        {
          name: "AAAA Records",
          keys: ["Song", "Artist", "Year"],
          values: [
            [
              "The Sliding Mr. Bones (Next Stop, Pottersville)",
              "Malcolm Lockyer",
              1961,
            ],
            ["Witchy Woman", "The Eagles", 1972],
            ["Shining Star", "Earth, Wind, and Fire", 1975],
          ],
        },
        {
          name: "CNAME Records",
          keys: ["Song", "Artist", "Year"],
          values: [
            [
              "The Sliding Mr. Bones (Next Stop, Pottersville)",
              "Malcolm Lockyer",
              1961,
            ],
            ["Witchy Woman", "The Eagles", 1972],
            ["Shining Star", "Earth, Wind, and Fire", 1975],
          ],
        },
        {
          name: "PTR Records",
          keys: ["Song", "Artist", "Year"],
          values: [],
        },
        {
          name: "MX Records",
          keys: ["Song", "Artist", "Year"],
          values: [],
        },
        {
          name: "TXT Records",
          keys: ["Song", "Artist", "Year"],
          values: [],
        },
      ],
    },
  };
};
