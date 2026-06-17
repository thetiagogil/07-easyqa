import { List } from "@mui/joy";
import { MarkReadButton } from "@/features/notifications/components/mark-read-button";
import { MainContainer } from "@/shared/components/layout/main-container";
import { NoData } from "@/shared/components/ui/no-data";
import { NotificationRow } from "@/features/notifications/components/notification-row";
import {
  getNotifications,
  getUnreadNotificationCount,
} from "@/features/notifications/server/queries";

export const NotificationsPage = async () => {
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
            <NotificationRow
              key={notification.id}
              notification={notification}
            />
          ))}
        </List>
      ) : (
        <NoData
          title="No notifications"
          description="Answers, follows, and accepted answers will appear here."
        />
      )}
    </MainContainer>
  );
};
