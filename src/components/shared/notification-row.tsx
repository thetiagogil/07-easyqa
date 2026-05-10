import { Link, ListItem, ListItemContent, Stack, Typography } from "@mui/joy";
import type { Notification } from "@/types/easyqa";
import { RelativeTime } from "./time";

export function NotificationRow({ notification }: { notification: Notification }) {
  return (
    <ListItem sx={{ borderBottom: "1px solid", borderColor: "divider", opacity: notification.isRead ? 0.55 : 1 }}>
      <ListItemContent>
        <Stack gap={0.5} py={1}>
          <Typography level="body-sm">{renderNotification(notification)}</Typography>
          <Typography level="body-xs" textColor="text.tertiary">
            <RelativeTime value={notification.createdAt} />
          </Typography>
        </Stack>
      </ListItemContent>
    </ListItem>
  );
}

function renderNotification(notification: Notification) {
  const actorName = notification.actor?.displayName ?? "Someone";
  const actorLink = notification.actorId ? (
    <Link component="a" href={`/profile/${notification.actorId}`} color="primary">
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
