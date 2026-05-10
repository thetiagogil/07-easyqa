import CheckIcon from "@mui/icons-material/Check";
import { Link, ListItem, ListItemContent, Stack, Typography } from "@mui/joy";
import { MAIN_BORDERS } from "@/lib/constants";
import type { Notification } from "@/types/easyqa";
import { RelativeTime } from "./time";

export function NotificationRow({ notification }: { notification: Notification }) {
  return (
    <ListItem
      sx={{
        borderBottom: MAIN_BORDERS,
        opacity: notification.isRead ? 0.5 : undefined,
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
          <Typography level="body-sm">{renderNotification(notification)}</Typography>
          <Typography level="body-xs" color="neutral">
            <RelativeTime value={notification.createdAt} />
          </Typography>
        </Stack>

        <Stack>{notification.isRead ? <CheckIcon /> : null}</Stack>
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
