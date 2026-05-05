import type { ReactNode } from "react";

export type WithChildren<T = {}> = T & { children: ReactNode };
export type SortType = "new" | "top" | "hot";
export type NotificationType = "answer_received" | "accepted_answer" | "follow";
