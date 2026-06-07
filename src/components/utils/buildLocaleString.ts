import Props from "../types/Uploader";

/**
 * Build a partial Uppy Dashboard locale config from Dash `localeString` props.
 * Only explicitly provided strings are included so Uppy defaults are preserved
 * for keys that were not passed from Python.
 */
const buildLocaleString = (localeString: Props["localeString"]): { strings: Record<string, string> } | undefined => {
  if (!localeString) return undefined;

  const strings = Object.fromEntries(
    Object.entries(localeString).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string"
    )
  );

  return Object.keys(strings).length === 0 ? undefined : {strings};
};

export default buildLocaleString;