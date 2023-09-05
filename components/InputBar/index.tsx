"use client";
import React, { useContext, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { ChatContext } from '@/context/ChatContext';
import { combineId } from '@/utils';
import { addLastMessage, sendMessageInFirestore } from '@/utils/firestore';
import { v4 as uuidv4 } from 'uuid';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from '@chakra-ui/react'


export const InputBar = () => {

    const { currentUser } = useContext(AuthContext);
    const { selectUserChat } = useContext(ChatContext);

    const [message, setMessage] = useState<string>("");
    const [showPicker, setShowPicker] = useState<boolean>(false);

    const handleSendMessage = async () => {

        if (currentUser.uid === null || message === '') return;
        const idChat = combineId(currentUser.uid, selectUserChat.uid);

        await sendMessageInFirestore(idChat, { id: uuidv4(), senderId: currentUser.uid, text: message, date: new Date().toUTCString() });

        //  Add last message current user
        addLastMessage(currentUser.uid, idChat, { message, idMessage: uuidv4() })

        //  Add last message user is chatting
        addLastMessage(selectUserChat.uid, idChat, { message, idMessage: uuidv4() })

        // Clear message typed
        setMessage('')
    }

    const handleChangeMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    }

    const handleEmojiSelect = (event: any, emojiObject: EmojiClickData) => {
        setMessage(message + emojiObject.emoji);
        setShowPicker(false)
    };


    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div
            className="absolute h-[56px] w-[394px] flex flex-row justify-between items-center 
            bg-white rounded-[12px] px-[16px] box-border bottom-2 left-1/2 transform -translate-x-1/2"
        >
            <div
                className="flex flex-row gap-4 items-center relative"
            >
                <div
                    className="h-fit ww-fit hover:cursor-pointer"
                    onClick={() => setShowPicker(true)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="21" viewBox="0 0 22 21" fill="none">
                        <path d="M11 -0.000999451C16.524 -0.000999451 21.002 4.477 21.002 10.001C21.002 15.524 16.524 20.002 11 20.002C5.476 20.002 0.998001 15.524 0.998001 10.001C0.998001 4.477 5.476 -0.000999451 11 -0.000999451ZM11 1.499C9.87581 1.48681 8.76036 1.6977 7.71822 2.11947C6.67608 2.54124 5.72793 3.16552 4.92866 3.95617C4.12939 4.74681 3.49487 5.68813 3.06182 6.72564C2.62877 7.76315 2.4058 8.87624 2.4058 10.0005C2.4058 11.1248 2.62877 12.2379 3.06182 13.2754C3.49487 14.3129 4.12939 15.2542 4.92866 16.0448C5.72793 16.8355 6.67608 17.4598 7.71822 17.8815C8.76036 18.3033 9.87581 18.5142 11 18.502C13.232 18.4678 15.361 17.5571 16.9274 15.9665C18.4937 14.376 19.3716 12.2333 19.3716 10.001C19.3716 7.76872 18.4937 5.62598 16.9274 4.03546C15.361 2.44494 13.232 1.53424 11 1.5V1.499ZM7.462 12.784C7.88275 13.32 8.41996 13.7532 9.03293 14.0509C9.64591 14.3486 10.3186 14.5028 11 14.502C11.6806 14.5028 12.3524 14.3489 12.9648 14.0519C13.5772 13.755 14.1141 13.3228 14.535 12.788C14.6583 12.6319 14.8386 12.5312 15.0362 12.5081C15.2337 12.4849 15.4324 12.5412 15.5885 12.6645C15.7446 12.7878 15.8453 12.9681 15.8684 13.1657C15.8916 13.3632 15.8353 13.5619 15.712 13.718C15.1507 14.4306 14.435 15.0064 13.6187 15.4021C12.8025 15.7977 11.9071 16.0028 11 16.002C10.0918 16.0027 9.19523 15.797 8.37821 15.4002C7.5612 15.0035 6.84508 14.4262 6.284 13.712C6.1662 13.5554 6.11439 13.3588 6.13968 13.1645C6.16497 12.9701 6.26533 12.7934 6.41929 12.6721C6.57326 12.5508 6.76858 12.4946 6.96346 12.5155C7.15834 12.5364 7.33729 12.6328 7.462 12.784ZM8 6.75C8.16706 6.74527 8.33337 6.7741 8.4891 6.83476C8.64483 6.89543 8.78681 6.98671 8.90665 7.10321C9.02648 7.2197 9.12174 7.35904 9.18679 7.51299C9.25184 7.66694 9.28535 7.83237 9.28535 7.9995C9.28535 8.16663 9.25184 8.33206 9.18679 8.48601C9.12174 8.63996 9.02648 8.7793 8.90665 8.8958C8.78681 9.01229 8.64483 9.10357 8.4891 9.16424C8.33337 9.22491 8.16706 9.25373 8 9.249C7.67473 9.2398 7.36587 9.10412 7.13906 8.8708C6.91224 8.63747 6.78535 8.3249 6.78535 7.9995C6.78535 7.6741 6.91224 7.36153 7.13906 7.12821C7.36587 6.89488 7.67473 6.7592 8 6.75ZM14 6.75C14.1671 6.74527 14.3334 6.7741 14.4891 6.83476C14.6448 6.89543 14.7868 6.98671 14.9066 7.10321C15.0265 7.2197 15.1217 7.35904 15.1868 7.51299C15.2518 7.66694 15.2854 7.83237 15.2854 7.9995C15.2854 8.16663 15.2518 8.33206 15.1868 8.48601C15.1217 8.63996 15.0265 8.7793 14.9066 8.8958C14.7868 9.01229 14.6448 9.10357 14.4891 9.16424C14.3334 9.22491 14.1671 9.25373 14 9.249C13.6747 9.2398 13.3659 9.10412 13.1391 8.8708C12.9122 8.63747 12.7854 8.3249 12.7854 7.9995C12.7854 7.6741 12.9122 7.36153 13.1391 7.12821C13.3659 6.89488 13.6747 6.7592 14 6.75Z" fill="#707991" />
                    </svg>
                </div>

                <Menu>
                    <MenuButton
                        transition='all 0.2s'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                            <path d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z"
                                fill='#707991'
                            />
                        </svg>
                    </MenuButton>
                    <MenuList>
                        <MenuItem>
                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
                                <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM64 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm152 32c5.3 0 10.2 2.6 13.2 6.9l88 128c3.4 4.9 3.7 11.3 1 16.5s-8.2 8.6-14.2 8.6H216 176 128 80c-5.8 0-11.1-3.1-13.9-8.1s-2.8-11.2 .2-16.1l48-80c2.9-4.8 8.1-7.8 13.7-7.8s10.8 2.9 13.7 7.8l12.8 21.4 48.3-70.2c3-4.3 7.9-6.9 13.2-6.9z" />
                            </svg>
                            <p className='ml-2' >Image</p>

                        </MenuItem>

                        <MenuItem>
                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
                                <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" />
                            </svg>
                            <p className='ml-2' >File</p>
                        </MenuItem>
                    </MenuList>
                </Menu>


                <input
                    className="focus:outline-none"
                    type="text"
                    placeholder="Message"
                    onChange={handleChangeMessage}
                    value={message}
                    onKeyPress={handleKeyPress}
                />

                {showPicker && (
                    <div
                        className="absolute left-[-5%] bottom-[200%]"
                    >
                        <EmojiPicker
                            lazyLoadEmojis={true}
                            onEmojiClick={(e) => handleEmojiSelect(e, e)}
                        />
                    </div>
                )}
            </div>

            <div
                className="hover:cursor-pointer"
                onClick={handleSendMessage}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12.815 12.197L5.28302 13.453C5.19642 13.4675 5.11516 13.5044 5.0474 13.5603C4.97964 13.6161 4.92778 13.6888 4.89702 13.771L2.30002 20.728C2.05202 21.368 2.72102 21.978 3.33502 21.671L21.335 12.671C21.4597 12.6087 21.5646 12.513 21.6379 12.3945C21.7111 12.2759 21.75 12.1394 21.75 12C21.75 11.8606 21.7111 11.7241 21.6379 11.6055C21.5646 11.487 21.4597 11.3913 21.335 11.329L3.33502 2.329C2.72102 2.022 2.05202 2.633 2.30002 3.272L4.89802 10.229C4.92863 10.3114 4.98044 10.3843 5.04821 10.4403C5.11598 10.4963 5.19731 10.5335 5.28402 10.548L12.816 11.803C12.8624 11.8111 12.9044 11.8353 12.9346 11.8714C12.9649 11.9074 12.9815 11.9529 12.9815 12C12.9815 12.0471 12.9649 12.0926 12.9346 12.1286C12.9044 12.1647 12.8624 12.1889 12.816 12.197H12.815Z" fill="#8BABD8" />
                </svg>
            </div>
        </div>
    )
}
