export function CapitalizeString([first, ...rest]: string) {
  return first.toUpperCase() + rest.join("");
}

export function SectionFormat(name: string) {
  return name.replace(/ /g, "_").replace(/\//g, "").toLowerCase();
}
