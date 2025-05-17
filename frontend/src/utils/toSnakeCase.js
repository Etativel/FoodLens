/* eslint-disable no-useless-escape */
export default function toSnakeCase(str) {
  return (
    str
      //camelCase boundaries → underscore
      .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
      //spaces, hyphens, etc. → underscore
      .replace(/[\s\-]+/g, "_")
      //remove anything thats not letter, number, or underscore
      .replace(/[^\w_]+/g, "")
      //collapse multiple underscores → single
      .replace(/__+/g, "_")
      //trim underscores at ends
      .replace(/^_+|_+$/g, "")
      //lowercase
      .toLowerCase()
  );
}
