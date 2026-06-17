import { Types } from "mongoose";
import { Notification, NotificationType } from "../models/Notification";

interface NotifyPayload {
  type: NotificationType;
  message: string;
  actorId?: string | null;
  actorName?: string;
  link?: string;
}

/** Create a single notification. Never throws — notification failure must not break the main action. */
export async function notify(userId: string, payload: NotifyPayload): Promise<void> {
  try {
    await Notification.create({
      userId: new Types.ObjectId(userId),
      type: payload.type,
      message: payload.message,
      actorId: payload.actorId ? new Types.ObjectId(payload.actorId) : null,
      actorName: payload.actorName || "",
      link: payload.link || "",
    });
  } catch (err) {
    console.error("notify error:", err);
  }
}

/** Notify several recipients at once, skipping empty/duplicate ids and an optional excluded id (e.g. the actor). */
export async function notifyMany(
  userIds: (string | null | undefined)[],
  payload: NotifyPayload,
  exclude?: string
): Promise<void> {
  const unique = [...new Set(userIds.filter(Boolean).map(String))].filter((id) => id !== exclude);
  await Promise.all(unique.map((id) => notify(id, payload)));
}
