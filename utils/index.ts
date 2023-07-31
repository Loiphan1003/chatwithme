import { AccountType } from "@/types";
import { Timestamp } from "firebase/firestore";

export const saveDataToCookie = (name: string, value: AccountType) => {
  const date = new Date();
  date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
  const expires = date.toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

export const combineId = (currentUserid: string, userId: string) => {
  return currentUserid > userId
    ? currentUserid + userId
    : userId + currentUserid;
};

export const formatTimeToHourAndMinute = (time: any) => {
  const timestamp: any = time;
  if(timestamp === undefined) return '';
  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours}:${minutes}`;
};
