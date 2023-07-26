import { AccountType, ChatHistoryType } from "@/types";
import React, { createContext, useState } from "react";


interface ChatContextType {
    selectUserChat: ChatHistoryType,
    handleSelectChat: (userChat: AccountType) => void,
}

export const ChatContext = createContext<ChatContextType>({
    selectUserChat: {
        avatar: '',
        displayName: '',
        uid: '',
    },
    handleSelectChat() {

    },

})

export const ChatContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [selectUserChat, setSelectUserChat] = useState<ChatHistoryType>({
        avatar: '',
        displayName: '',
        uid: '',
    })

    const handleSelectChat = (userChat: AccountType) => {
        setSelectUserChat(userChat)
    }

    

    return (
        <ChatContext.Provider
            value={{selectUserChat, handleSelectChat}}
        >
            {children}
        </ChatContext.Provider>
    )
}

export default ChatContextProvider;