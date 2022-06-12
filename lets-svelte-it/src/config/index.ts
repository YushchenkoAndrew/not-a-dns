export const NAV_BAR = [
  { name: "/mortis-greamreaper", href: "home", target: "_blank" },
  { name: "/grape", href: "test", target: "_blank" },
  { name: "/void", href: "t", target: "_blank" },
  { name: "/botodachi", href: "#", target: "_blank" },
];

export const CHAPTERS = {
  records: [
    { icon: "fa-circle", name: "A Records" },
    { icon: "fa-circle", name: "AAAA Records" },
    { icon: "fa-circle", name: "CNAME Records" },
    { icon: "fa-circle", name: "PTR Records" },
    { icon: "fa-circle", name: "MX Records" },
    { icon: "fa-circle", name: "TXT Records" },
  ],
};

// NOTE: Forced to do in such way because
// tailwind cant process string concatenation
export const BG_COLORS = [
  "bg-red-300 dark:bg-transparent dark:border-b-4 dark:border-red-400",
  "bg-orange-300 dark:bg-transparent dark:border-b-4 dark:border-orange-400",
  "bg-green-300 dark:bg-transparent dark:border-b-4 dark:border-green-400",
  "bg-teal-300 dark:bg-transparent dark:border-b-4 dark:border-teal-400",
  "bg-indigo-300 dark:bg-transparent dark:border-b-4 dark:border-indigo-400",
  "bg-blue-300 dark:bg-transparent dark:border-b-4 dark:border-blue-400",
  "bg-yellow-200 dark:bg-transparent dark:border-b-4 dark:border-yellow-300",
];

export const DECORATION_COLORS = [
  "group-hover:decoration-red-300 dark:group-hover:decoration-red-400",
  "group-hover:decoration-orange-300 dark:group-hover:decoration-orange-400",
  "group-hover:decoration-green-300 dark:group-hover:decoration-green-400",
  "group-hover:decoration-teal-300 dark:group-hover:decoration-teal-400",
  "group-hover:decoration-indigo-300 dark:group-hover:decoration-indigo-400",
  "group-hover:decoration-blue-300 dark:group-hover:decoration-blue-400",
  "group-hover:decoration-yellow-200 dark:group-hover:decoration-yellow-300",
];
