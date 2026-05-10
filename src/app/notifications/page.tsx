import { List, Stack, Typography } from "@mui/joy";
import { MarkReadButton } from "@/components/actions/mark-read-button";
import { EmptyState } from "@/components/shared/empty-state";
import { NotificationRow } from "@/components/shared/notification-row";
import { getNotifications, getUnreadNotificationCount, requireProfile } from "@/lib/easyqa/data";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  await requireProfile();
  const [notifications, unreadCount] = await Promise.all([
    getNotifications(),
    getUnreadNotificationCount(),
  ]);

  return (
    <Stack>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        p={2}
        borderBottom="1px solid"
        borderColor="divider"
      >
        <Stack>
          <Typography level="h2">Notifications</Typography>
          <Typography level="body-sm" textColor="text.tertiary">
            {unreadCount} unread
          </Typography>
        </Stack>
        <MarkReadButton disabled={unreadCount === 0} />
      </Stack>

      {notifications.length ? (
        <List sx={{ p: 0 }}>
          {notifications.map((notification) => (
            <NotificationRow key={notification.id} notification={notification} />
          ))}
        </List>
      ) : (
        <EmptyState title="No notifications" body="Answers, accepted answers, and follows appear here." />
      )}
    </Stack>
  );
}
