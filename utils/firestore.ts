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
  let idUserExsit: string = "";
  const q = query(collection(db, "users"), where("uid", "==", value.uid));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc: any) => {
    return (idUserExsit = doc.id);
  });

  if (idUserExsit === "") return false;
  return true;
};

export const checkAccountExsitAndAdd = async (account: AccountType) => {
  const checkAccountLogin = await checkAccountIsExsit(account);
  if (checkAccountLogin) return;
  return addDocument("users", account);
};

export const findNameAccount = async (
  searchName: string,
  currentUserId: string
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
          lastMessage: '',
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
        lastMessage: '',
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

    // find the message colection
    // const q = query(collection(db, "chats"), where("__name__", "==", idChat));
    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => {
    //   res = { ...doc.data(), id: doc.id } as { id: string; message: any[] };
    // });

    // if (res.message === undefined) {
    //   const temp: MessageType[] = [];
    //   temp.push(messageSend);

    //   res.message = temp;
    // }

    await updateDoc(doc(db, 'chats', idChat), {
      messages: arrayUnion({
        id: messageSend.id,
        text: messageSend.text,
        date: Timestamp.now(),
        senderId: messageSend.senderId
      })
    })

    console.log(res.message);

    return res;
  } catch (error) {
    console.log(`Send message error: ${error}`);
  }
};
