import dayjs from "dayjs";
import "dayjs/locale/ja";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.locale("ja");

export function formatDate(date: string): string {
  return dayjs(date.toString()).format("YYYY年MM月DD日");
}

export function formatRelativeDate(date: string): string {
  return dayjs(date.toString()).fromNow();
}
