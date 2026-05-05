import { RefObject, useEffect } from "react";

export const useInfiniteScrollObserver = ({
  targetRef,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: {
  targetRef: RefObject<HTMLElement | null>;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}) => {
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { threshold: 1 },
    );
    const current = targetRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
};
