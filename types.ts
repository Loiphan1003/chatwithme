export interface AccountType {
    uid: string,
    displayName: string | null,
    email: string | null,
    avatar: string | null,
}

export interface ChatHistoryType {
    uid: string,
    displayName: string|null,
    avatar: string|null,
}

export interface MessageType {
    id: string,
    senderId: string,
    text: string,
    date: string,
}

export interface User {
    uid: string,
    displayName: string | null,
    email: string | null,
    avatar: string | null,
    isActive: boolean | null,
    dateUse: string | null,
}