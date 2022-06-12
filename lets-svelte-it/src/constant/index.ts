export const NAV_BAR = [
  { name: "/mortis-greamreaper", href: "home", target: "_blank" },
  { name: "/grape", href: "test", target: "_blank" },
  { name: "/void", href: "t", target: "_blank" },
  { name: "/botodachi", href: "#", target: "_blank" },
];

export const CHAPTERS = {
  records: [
    { on: "fa-circle", off: "fa-dot-circle", name: "A Records" },
    { on: "fa-circle", off: "fa-dot-circle", name: "AAAA Records" },
    { on: "fa-circle", off: "fa-dot-circle", name: "CNAME Records" },
    { on: "fa-circle", off: "fa-dot-circle", name: "PTR Records" },
    { on: "fa-circle", off: "fa-dot-circle", name: "MX Records" },
    { on: "fa-circle", off: "fa-dot-circle", name: "TXT Records" },
  ],
};

// NOTE: Forced to do in such way because
// tailwind cant process string concatenation
export const BG_COLORS = [
  "bg-red-300",
  "bg-orange-300",
  "bg-green-300",
  "bg-teal-300",
  "bg-indigo-300",
  "bg-blue-300",
  "bg-yellow-200",
];

export const DECORATION_COLORS = [
  "group-hover:decoration-red-300",
  "group-hover:decoration-orange-300",
  "group-hover:decoration-green-300",
  "group-hover:decoration-teal-300",
  "group-hover:decoration-indigo-300",
  "group-hover:decoration-blue-300",
  "group-hover:decoration-yellow-200",
];
