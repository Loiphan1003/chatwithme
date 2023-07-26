import { AccountType } from "@/types";

export const saveDataToCookie = (name: string, value: AccountType) => {
  const date = new Date();
  date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
  const expires = date.toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

export const combineId = (currentUserid: string, userId: string) => {
  return currentUserid > userId ? currentUserid + userId : userId + currentUserid;
};
