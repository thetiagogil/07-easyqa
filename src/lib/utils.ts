import dayjs from "./dayjs";

const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const dateFormat = (utcDate: string | Date, format = "HH:mm · DD/MM/YYYY") => {
  return dayjs.utc(utcDate).tz(userTimeZone).format(format);
};

export const dateFromNow = (utcDate: string | Date) => {
  return dayjs.utc(utcDate).tz(userTimeZone).fromNow();
};

export const shortAddress = (address?: string) => {
  if (!address) return "";
  return `${address.toLowerCase().slice(0, 6)}...${address.toLowerCase().slice(-4)}`;
};

export const userName = (user?: any) => {
  return user?.name ? user?.name : shortAddress(user?.wallet);
};
