import { mapProfile } from "@/shared/server/mappers";
import type {
  Notification,
  NotificationRow,
  NotificationType,
  ProfileRow,
} from "@/types/easyqa";

export function mapNotification(
  row: NotificationRow,
  actor: ProfileRow | null,
): Notification {
  return {
    id: row.id,
    type: normalizeNotificationType(row.type),
    actorId: row.actor_id,
    actor: actor ? mapProfile(actor) : null,
    questionId: row.question_id,
    answerId: row.answer_id,
    isRead: row.is_read,
    createdAt: row.created_at,
  };
}

function normalizeNotificationType(value: string): NotificationType {
  if (value === "answer_accepted" || value === "followed") return value;
  return "answer_received";
}
