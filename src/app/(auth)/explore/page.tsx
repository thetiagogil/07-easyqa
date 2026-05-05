"use client";
import { MainContainer } from "@/components/layout/main-container";
import { CustomAvatar } from "@/components/shared/custom-avatar";
import { Loading } from "@/components/shared/loading";
import { NoData } from "@/components/shared/no-data";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useInfiniteScrollObserver } from "@/hooks/useInfiniteScrollObserver";
import { useGetUsers } from "@/hooks/useUserApi";
import { MAIN_BORDERS } from "@/lib/constants";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  CircularProgress,
  Input,
  List,
  ListItem,
  ListItemContent,
  Typography,
} from "@mui/joy";
import NextLink from "next/link";
import { useEffect, useRef, useState } from "react";

export default function ExplorePage() {
  const [search, setSearch] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const debouncedSearch = useDebouncedValue(search, 1000);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const {
    data: usersRaw,
    isPending: isPendingUsers,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useGetUsers(debouncedSearch);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setIsSearching(true);
  };

  const users = usersRaw?.pages.flat() || [];

  useEffect(() => {
    if (!isFetching && debouncedSearch === search) {
      setIsSearching(false);
    }
  }, [isFetching, debouncedSearch, search]);

  useInfiniteScrollObserver({
    targetRef: loadMoreRef,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  return (
    <MainContainer
      navbarProps={{
        title: "explore",
        hasBackButton: true,
        fullItem: (
          <Input
            placeholder="search for a user..."
            fullWidth
            startDecorator={<SearchIcon />}
            value={search}
            onChange={handleSearchChange}
            endDecorator={isSearching ? <CircularProgress size="sm" thickness={1} /> : null}
            aria-label="search users"
          />
        ),
      }}
      noPad
    >
      {isPendingUsers ? (
        <Loading />
      ) : !users ? (
        <NoData />
      ) : (
        <>
          <List sx={{ p: 0 }}>
            {users.map((user) => (
              <ListItem key={user.id} sx={{ borderBottom: MAIN_BORDERS, p: 0 }}>
                <ListItemContent
                  component={NextLink}
                  href={`/profile/${user.id}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    gap: 2,
                    textDecoration: "none",
                    backgroundColor: "transparent",
                    transition: "0.3s",
                    "&:hover": {
                      backgroundColor: "neutral.700",
                    },
                  }}
                >
                  <CustomAvatar user={user} size={32} fontSize={12} />

                  <Typography level="title-sm" color="primary" fontWeight={700}>
                    {user.name}
                  </Typography>
                  <Typography level="body-sm" noWrap>
                    {user.bio}
                  </Typography>
                </ListItemContent>
              </ListItem>
            ))}
          </List>

          {hasNextPage && <Box ref={loadMoreRef} />}
        </>
      )}
    </MainContainer>
  );
}
