"use client";
import { MainContainer } from "@/components/layout/main-container";
import { Loading } from "@/components/shared/loading";
import { NoData } from "@/components/shared/no-data";
import {
  useGetNotifications,
  useGetUnreadNotificationsCount,
  useReadAllNotifications,
} from "@/hooks/useNotificationApi";
import { MAIN_BORDERS } from "@/lib/constants";
import { dateFormat } from "@/lib/utils";
import { Notification } from "@/types";
import CheckIcon from "@mui/icons-material/Check";
import { Box, Button, Link, List, ListItem, ListItemContent, Stack, Typography } from "@mui/joy";
import NextLink from "next/link";
import { useEffect, useRef } from "react";

export default function NotificationsPage() {
  const {
    data: notificationsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending: isPendingNotifications,
  } = useGetNotifications();
  const { data: unreadCount, isPending: isPendingUnreadCount } = useGetUnreadNotificationsCount();
  const { mutate: markAllAsRead } = useReadAllNotifications();

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const notifications = notificationsData?.pages.flat() || [];
  const isPending = isPendingNotifications || isPendingUnreadCount;

  const notificationRenderMap: Record<string, (n: any) => React.ReactNode> = {
    answer_received: (n) => (
      <>
        Your question received a new{" "}
        <Link component={NextLink} href={`/question/${n.relatedId}`} color="primary">
          answer
        </Link>
        .
      </>
    ),
    answer_accepted: (n) => (
      <>
        Your{" "}
        <Link component={NextLink} href={`/question/${n.relatedId}`} color="primary">
          answer
        </Link>{" "}
        was accepted!
      </>
    ),
    followed: (n) => (
      <>
        <Link component={NextLink} href={`/profile/${n.relatedId}`} color="primary">
          Someone
        </Link>{" "}
        started following you.
      </>
    ),
  };

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { threshold: 1 },
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <MainContainer
      navbarProps={{
        title: "notifications",
        hasBackButton: true,
        endItem: (
          <Button
            size="sm"
            onClick={() => markAllAsRead()}
            variant="soft"
            color="neutral"
            disabled={isPending || unreadCount == 0}
          >
            read all
          </Button>
        ),
      }}
      noPad
    >
      {isPending ? (
        <Loading />
      ) : notifications?.length > 0 ? (
        <List sx={{ p: 0 }}>
          {notifications.map((n: Notification) => {
            return (
              <ListItem
                key={n.id}
                sx={{
                  borderBottom: MAIN_BORDERS,
                  opacity: n.isRead ? 0.5 : undefined,
                  p: 0,
                }}
              >
                <ListItemContent
                  component={Stack}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  p={2}
                >
                  <Stack>
                    <Typography level="body-sm">
                      {notificationRenderMap[n.type]?.(n) ?? "Unknown notification"}
                    </Typography>

                    <Typography level="body-xs" color="neutral">
                      {dateFormat(n.createdAt!)}
                    </Typography>
                  </Stack>

                  <Stack>{n.isRead ? <CheckIcon /> : null}</Stack>
                </ListItemContent>
              </ListItem>
            );
          })}

          {hasNextPage && <Box ref={loadMoreRef} />}
        </List>
      ) : (
        <NoData />
      )}
    </MainContainer>
  );
}
