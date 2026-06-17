const postgrestFilterEscapeMap: Record<string, string> = {
  "\\": "\\\\",
  '"': '\\"',
};

export const quotePostgrestFilterValue = (value: string) => {
  const escaped = value.replace(
    /["\\]/g,
    (character) => postgrestFilterEscapeMap[character] ?? character,
  );

  return `"${escaped}"`;
};

export const createIlikeContainsFilter = (value: string) => {
  return quotePostgrestFilterValue(`%${value}%`);
};
