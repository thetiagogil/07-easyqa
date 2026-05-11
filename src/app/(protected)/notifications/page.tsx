import { List } from "@mui/joy";
import { MarkReadButton } from "@/components/actions/mark-read-button";
import { MainContainer } from "@/components/layout/main-container";
import { NoData } from "@/components/shared/no-data";
import { NotificationRow } from "@/components/shared/notification-row";
import { getNotifications, getUnreadNotificationCount } from "@/lib/easyqa/data";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const [notifications, unreadCount] = await Promise.all([
    getNotifications(),
    getUnreadNotificationCount(),
  ]);

  return (
    <MainContainer
      navbarProps={{
        title: "notifications",
        hasBackButton: true,
        endItem: <MarkReadButton disabled={unreadCount === 0} />,
      }}
      noPad
    >
      {notifications.length ? (
        <List sx={{ p: 0 }}>
          {notifications.map((notification) => (
            <NotificationRow key={notification.id} notification={notification} />
          ))}
        </List>
      ) : (
        <NoData />
      )}
    </MainContainer>
  );
}
