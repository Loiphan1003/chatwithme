"use client"
import React, { useCallback, useContext, useEffect, useState } from 'react'
import SearchBar from '@/components/SearchBar';
import { ChatListItem } from '@/components/ChatListItem';
import Image from 'next/image';
import { InputBar } from '@/components/InputBar';
import { DateSent } from '@/components/DateSent';
import { MessageSent } from '@/components/MessageSent';
import avatarTest from '../../assets/images/Avatar.png';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { AccountType, ChatHistoryType, MessageType, User } from '@/types';
import { ChatContext } from '@/context/ChatContext';
import { DocumentData, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { combineId } from '@/utils';
import { getIdUser } from '@/utils/firestore';

export default function Chats() {

    const router = useRouter();
    const { currentUser } = useContext(AuthContext);
    const { selectUserChat, handleSelectChat } = useContext(ChatContext);

    const [chats, setChats] = useState();
    const [accountChat, setAccountChat] = useState<User>({
        uid: '',
        displayName: '',
        email: '',
        avatar: '',
        isActive: false,
        dateUse: '',
    });
    const [messages, setMessages] = useState([]);

    const getChats = () => {
        const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc: DocumentData) => {
            setChats(doc.data());
        });

        return () => {
            unsub();
        }
    }

    const formatTimeUse = (dateUse: string) => {
        const date = new Date();
        const accountDateUse = new Date(dateUse);
        const res = date.getMinutes() - accountDateUse.getMinutes();
        if(res > 0 && res < 60) return `Hoạt động ${res} phút trước`;
        return "vài tiếng trước";
    }

    const getStatusUserChat = useCallback(async () => {
        if(selectUserChat.uid === '') return;
        const res = await getIdUser(selectUserChat.uid);
        if (res === undefined) return;
        const unsub = onSnapshot(doc(db, "users", res), (doc: DocumentData) => {
            setAccountChat({...doc.data(), dateUse: formatTimeUse(doc.data().dateUse)});
        });

        return () => {
            unsub()
        } 

    }, [selectUserChat])

    useEffect(() => {
        if (currentUser.uid === '') return router.push('/');
        getChats()

    }, [currentUser, getChats])

    useEffect(() => {
        getStatusUserChat();
    }, [getStatusUserChat])

    const handleSelectChatInSideBar = (userChat: AccountType) => {
        handleSelectChat(userChat);
    }

    const handleGetConservasion = useCallback(() => {
        if (selectUserChat.uid === '') return;
        const id = combineId(currentUser.uid, selectUserChat.uid)
        const unsub = onSnapshot(doc(db, "chats", id), (doc: DocumentData) => {
            const mes = doc.data().messages;
            if (mes === undefined) return;
            setMessages(mes);
        });

        return () => {
            unsub();
        }
    }, [selectUserChat])

    const handleFormatTypeMessage = (senderId: string) => {
        if (senderId === currentUser.uid) return 'send';
        return 'otherSend';
    }




    useEffect(() => {
        handleGetConservasion()
    }, [handleGetConservasion])


    return (
        <div
            className="bg-white h-[100vh] flex flex-row"
        >
            <div
                className="w-[364px] h-full text-black border-r border-solid border-r-[#D9DCE0]"
            >
                <SearchBar />

                <div
                    className="mt-2 h-[92%] overflow-y-auto overflow-x-hidden"
                >
                    {chats !== undefined && Object.entries(chats)?.sort((a: any, b: any) => { return b[1].date - a[1].date }).map((chat: any) => {
                        return (
                            <ChatListItem
                                key={chat[0]}
                                data={chat[1].userInfo}
                                lastMessages={chat[1].lastMessage}
                                handleClick={() =>
                                    handleSelectChatInSideBar(chat[1].userInfo)
                                }
                            />
                        )
                    })}
                </div>
            </div>

            <div className="text-black w-full">

                {selectUserChat.uid !== '' &&
                    <React.Fragment>
                        <div
                            className="py-2 px-4 w-auto flex flex-row justify-between items-center
                    border-b border-solid border-b-navyGrey"
                        >
                            <div
                                className="flex flex-row gap-[16px] items-center"
                            >
                                <Image
                                    className="rounded-[50%]"
                                    src={selectUserChat.avatar !== null ? selectUserChat.avatar : avatarTest}
                                    alt='avatar'
                                    height={48}
                                    width={48}
                                    loading='lazy'
                                />

                                <div>
                                    <p className="text-[16px] text-richBlack not-italic font-semibold leading-[20px]">{selectUserChat.displayName}</p>

                                    {accountChat.isActive === true ?
                                        <p
                                            className="text-navyGrey text-[14px] not-italic font-normal leading-[18px]"
                                        >
                                            đang hoạt động
                                        </p> :

                                        <p 
                                            className="text-navyGrey text-[14px] not-italic font-normal leading-[18px]
                                            " 
                                        >
                                            {accountChat.dateUse}
                                        </p>
                                    }

                                </div>
                            </div>

                            {/* <div
                                className="flex flex-row gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M9.99997 2.5C11.3979 2.49994 12.7681 2.89061 13.9559 3.62792C15.1436 4.36523 16.1016 5.41983 16.7218 6.6727C17.342 7.92558 17.5997 9.32686 17.4658 10.7184C17.3319 12.11 16.8117 13.4364 15.964 14.548L20.707 19.293C20.8863 19.473 20.9904 19.7144 20.9982 19.9684C21.006 20.2223 20.9168 20.4697 20.7487 20.6603C20.5807 20.8508 20.3464 20.9703 20.0935 20.9944C19.8406 21.0185 19.588 20.9454 19.387 20.79L19.293 20.707L14.548 15.964C13.601 16.6861 12.4956 17.1723 11.3234 17.3824C10.1512 17.5925 8.9458 17.5204 7.80697 17.1721C6.66814 16.8238 5.62862 16.2094 4.77443 15.3795C3.92023 14.5497 3.27592 13.5285 2.8948 12.4002C2.51368 11.2719 2.40672 10.0691 2.58277 8.89131C2.75881 7.7135 3.2128 6.59454 3.90717 5.62703C4.60153 4.65951 5.51631 3.87126 6.57581 3.32749C7.63532 2.78372 8.80908 2.50006 9.99997 2.5ZM9.99997 4.5C8.54128 4.5 7.14233 5.07946 6.11088 6.11091C5.07943 7.14236 4.49997 8.54131 4.49997 10C4.49997 11.4587 5.07943 12.8576 6.11088 13.8891C7.14233 14.9205 8.54128 15.5 9.99997 15.5C11.4587 15.5 12.8576 14.9205 13.8891 13.8891C14.9205 12.8576 15.5 11.4587 15.5 10C15.5 8.54131 14.9205 7.14236 13.8891 6.11091C12.8576 5.07946 11.4587 4.5 9.99997 4.5Z" fill="#707991" />
                                </svg>

                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M7.77201 2.43899L8.84801 2.09499C9.85801 1.77299 10.935 2.29399 11.368 3.31199L12.227 5.33999C12.601 6.22299 12.394 7.26199 11.713 7.90799L9.81901 9.70599C9.93501 10.782 10.297 11.841 10.903 12.883C11.4788 13.8912 12.251 14.7736 13.174 15.478L15.449 14.718C16.312 14.431 17.251 14.762 17.779 15.539L19.012 17.349C19.627 18.253 19.517 19.499 18.754 20.265L17.936 21.086C17.122 21.903 15.959 22.2 14.884 21.864C12.345 21.072 10.011 18.721 7.88101 14.811C5.74801 10.895 4.99501 7.57099 5.62301 4.84299C5.88701 3.69499 6.70401 2.77999 7.77201 2.43899Z" fill="#707991" />
                                </svg>

                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 8C11.4696 8 10.9609 7.78929 10.5858 7.41421C10.2107 7.03914 10 6.53043 10 6C10 5.46957 10.2107 4.96086 10.5858 4.58579C10.9609 4.21071 11.4696 4 12 4C12.5304 4 13.0391 4.21071 13.4142 4.58579C13.7893 4.96086 14 5.46957 14 6C14 6.53043 13.7893 7.03914 13.4142 7.41421C13.0391 7.78929 12.5304 8 12 8ZM12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14ZM10 18C10 18.5304 10.2107 19.0391 10.5858 19.4142C10.9609 19.7893 11.4696 20 12 20C12.5304 20 13.0391 19.7893 13.4142 19.4142C13.7893 19.0391 14 18.5304 14 18C14 17.4696 13.7893 16.9609 13.4142 16.5858C13.0391 16.2107 12.5304 16 12 16C11.4696 16 10.9609 16.2107 10.5858 16.5858C10.2107 16.9609 10 17.4696 10 18Z" fill="#707991" />
                                </svg>
                            </div> */}

                        </div>

                        <div
                            className="w-full h-[93vh] bg-[#8BABD8] relative 
                    flex flex-col"
                        >
                            <div
                                className="h-[93%] overflow-y-auto"
                            >
                                <div
                                    className="w-auto px-[12px] pt-[24px] box-border"
                                >
                                    {messages !== undefined && messages.map((m: MessageType) => (
                                        <React.Fragment
                                            key={m.id}
                                        >
                                            {/* <div
                                        className='flex justify-center '
                                    >
                                        <DateSent />
                                    </div> */}
                                            <MessageSent
                                                type={handleFormatTypeMessage(m.senderId)}
                                                text={m.text}
                                                time={m.date}
                                            />
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>

                            <InputBar />
                        </div>
                    </React.Fragment>
                }

                {selectUserChat.uid === '' &&
                    <div
                        className="w-full h-full flex flex-col justify-center items-center bg-[#8BABD8]
                    text-richBlack not-italic leading-5 text-[16px]"
                    >
                        <p>Bạn chưa chọn người để trò chuyện</p>
                        <p>Vui lòng chọn người và bắt đầu cuộc trò chuyện!</p>
                    </div>}
            </div>
        </div>
    )
}
