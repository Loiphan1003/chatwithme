import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  DocumentData,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { AccountType, MessageType } from "@/types";

export const addDocument = async (
  nameColection: string,
  value: AccountType
) => {
  try {
    await addDoc(collection(db, nameColection), value);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const checkAccountIsExsit = async (value: AccountType) => {
  let idUserExsit: AccountType = {
    uid: "",
    avatar: "",
    displayName: "",
    email: "",
  };
  let id: string = "";
  const q = query(collection(db, "users"), where("uid", "==", value.uid));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc: DocumentData) => {
    id = doc.id;
    return (idUserExsit = doc.data());
  });

  if (idUserExsit.uid === "") return false;

  await updateDoc(doc(db, "users", id), {
    displayName: idUserExsit.displayName,
    avatar: idUserExsit.avatar,
    email: idUserExsit.email,
    uid: idUserExsit.uid,
    isActive: true,
  });

  return true;
};

export const checkAccountExsitAndAdd = async (account: AccountType) => {
  const checkAccountLogin = await checkAccountIsExsit(account);
  if (checkAccountLogin) return;
  const user = {
    displayName: account.displayName,
    avatar: account.avatar,
    email: account.email,
    uid: account.uid,
    isActive: true,
    dateUse: new Date().toUTCString(),
  };
  return addDocument("users", user);
};

export const findNameAccount = async (
  searchName: string
  // currentUserId: string
) => {
  let accountIsFind: any[] = [];

  const q = query(
    collection(db, "users"),
    where("displayName", "==", searchName)
  );
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const user: DocumentData = doc.data();
    accountIsFind.push(user);
  });

  return accountIsFind;
};

export const createOrUpdateUserChats = async (
  idChat: string,
  userChatId: string,
  data: AccountType
) => {
  try {
    const res = await getDoc(doc(db, "userChats", userChatId));

    if (!res.exists()) {
      await setDoc(doc(db, "userChats", userChatId), {
        [idChat]: {
          userInfo: {
            uid: data.uid,
            displayName: data.displayName,
            avatar: data.avatar,
          },
          lastMessage: "",
          date: serverTimestamp(),
        },
      });
      return;
    }
    await updateDoc(doc(db, "userChats", userChatId), {
      [idChat]: {
        userInfo: {
          uid: data.uid,
          displayName: data.displayName,
          avatar: data.avatar,
        },
        lastMessage: "",
        date: serverTimestamp(),
      },
    });
  } catch (error) {
    console.log(`CreateUserChatsError: ${error}`);
  }
};

export const handleSelectChat = async (
  idChat: string,
  currentUser: AccountType,
  userSelect: AccountType
) => {
  try {
    const resChat = await getDoc(doc(db, "chats", idChat));

    if (!resChat.exists()) {
      // create a chat
      await setDoc(doc(db, "chats", idChat), { messages: [] });

      // create user chats
      createOrUpdateUserChats(idChat, currentUser.uid, userSelect);
      createOrUpdateUserChats(idChat, userSelect.uid, currentUser);
      return;
    }
  } catch (error) {
    console.log(error);
  }
};

export const sendMessageInFirestore = async (
  idChat: string,
  messageSend: MessageType
) => {
  try {
    let res: { id: string; message: MessageType[] } = {
      id: "",
      message: [],
    };

    await updateDoc(doc(db, "chats", idChat), {
      messages: arrayUnion({
        id: messageSend.id,
        text: messageSend.text,
        date: Timestamp.now(),
        senderId: messageSend.senderId,
      }),
    });

    return res;
  } catch (error) {
    console.log(`Send message error: ${error}`);
  }
};

export const changeStatusActiveAccount = async (currentUserId: string) => {
  try {
    let user: AccountType = {
      uid: "",
      avatar: "",
      displayName: "",
      email: "",
    };
    let id: string = "";
    const q = query(collection(db, "users"), where("uid", "==", currentUserId));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc: DocumentData) => {
      id = doc.id;
      return (user = doc.data());
    });

    await updateDoc(doc(db, "users", id), {
      displayName: user.displayName,
      avatar: user.avatar,
      email: user.email,
      uid: user.uid,
      isActive: false,
      dateUse: new Date().toUTCString(),
    });
  } catch (error) {}
};

export const getIdUser = async (currentUserId: string) => {
  try {
    let id: string = "";
    const q = query(collection(db, "users"), where("uid", "==", currentUserId));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc: DocumentData) => {
      return (id = doc.id);
    });

    return id;
  } catch (error) {
    console.log(error);
  }
};

export const addLastMessage = async (
  currentUserId: string,
  idChat: string,
  { message, idMessage }: { message: string; idMessage: string }
) => {
  try {
    const res = await getDoc(doc(db, "userChats", currentUserId));
    const data = res.data();
    if (data === undefined) return;
    for (const key in data) {
      if (key === idChat) {
        const value: any = data[key];
        value.lastMessage = {
          idMessage,
          message,
          date: Timestamp.now(),
        };
        break;
      }
    }
    await updateDoc(doc(db, "userChats", currentUserId), data);
  } catch (error) {}
};
