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
} as { [key: string]: { icon: string; name: string }[] };

export const DNS_API = import.meta.env.VITE_DNS_API || "localhost";
