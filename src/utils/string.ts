export const toKebabCase = (str?: string) => {
  return str
    // replace aA to a-A
    ?.replace(/([a-z])([A-Z])/g, "$1-$2")
    // replace spaces and _ to dashes
    ?.replace(/[\s_]+/g, '-')
    // turn text into lower case
    ?.toLowerCase();
}
