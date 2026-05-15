import CheckIcon from "@mui/icons-material/Check";
import { Box, Link, ListItem, ListItemContent, Stack, Typography } from "@mui/joy";
import { MAIN_BORDERS } from "@/shared/constants/app";
import type { Notification } from "@/types/easyqa";
import { RelativeTime } from "@/shared/components/ui/relative-time";

export function NotificationRow({ notification }: { notification: Notification }) {
  return (
    <ListItem
      sx={{
        borderBottom: MAIN_BORDERS,
        opacity: notification.isRead ? 0.62 : undefined,
        p: 0,
        transition: "0.3s",
        "&:hover": { bgcolor: "background.level1" },
      }}
    >
      <ListItemContent
        component={Stack}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        p={{ xs: 2, sm: 2.5 }}
        gap={2}
      >
        <Stack direction="row" alignItems="flex-start" gap={1.25} minWidth={0}>
          <Box
            sx={{
              width: 8,
              height: 8,
              mt: 0.75,
              borderRadius: "50%",
              bgcolor: notification.isRead ? "transparent" : "primary.500",
              flexShrink: 0,
            }}
          />
          <Stack minWidth={0}>
            <Typography level="body-sm">{renderNotification(notification)}</Typography>
            <Typography level="body-xs" textColor="neutral.500">
              <RelativeTime value={notification.createdAt} />
            </Typography>
          </Stack>
        </Stack>

        <Stack color="neutral.500">
          {notification.isRead ? <CheckIcon fontSize="small" /> : null}
        </Stack>
      </ListItemContent>
    </ListItem>
  );
}

function renderNotification(notification: Notification) {
  const actorName = notification.actor?.displayName ?? "Someone";
  const actorLink = notification.actorId ? (
    <Link component="a" href={`/profile/${notification.actorId}`} color="primary" fontWeight={700}>
      {actorName}
    </Link>
  ) : (
    actorName
  );

  if (notification.type === "followed") {
    return <>{actorLink} started following you.</>;
  }

  if (notification.type === "answer_accepted") {
    return (
      <>
        {actorLink} accepted your{" "}
        <Link component="a" href={`/question/${notification.questionId}`} color="primary">
          answer
        </Link>
        .
      </>
    );
  }

  return (
    <>
      {actorLink} answered your{" "}
      <Link component="a" href={`/question/${notification.questionId}`} color="primary">
        question
      </Link>
      .
    </>
  );
}
