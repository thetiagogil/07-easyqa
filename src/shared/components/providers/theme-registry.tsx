"use client";

import createCache, {
  type Options as EmotionCacheOptions,
} from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";
import { useState, type ReactNode } from "react";

type ThemeRegistryProps = {
  children: ReactNode;
  options: EmotionCacheOptions;
};

export function ThemeRegistry({ children, options }: ThemeRegistryProps) {
  const [{ cache, flush }] = useState(() => {
    const cache = createCache(options);
    cache.compat = true;

    const previousInsert = cache.insert;
    let inserted: string[] = [];

    cache.insert = (...args) => {
      const serialized = args[1];

      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }

      return previousInsert(...args);
    };

    const flush = () => {
      const previouslyInserted = inserted;
      inserted = [];
      return previouslyInserted;
    };

    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) return null;

    let styles = "";

    for (const name of names) {
      const insertedStyle = cache.inserted[name];
      if (typeof insertedStyle === "string") {
        styles += insertedStyle;
      }
    }

    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
