import React from 'react';
import Image from 'next/image';
import avatarTest from '../../assets/images/Avatar.png';
import { AccountType } from '@/types';

interface ChatListItemProps {
    // displayName: string,
    // avatar: string,
    // uid: string,
    data: AccountType,
    handleClick: (user: AccountType) => void,
}

export const ChatListItem = (props: ChatListItemProps) => {
    return (
        <div
            className="flex flex-row gap-4 px-4 py-3"
            onClick={() => props.handleClick(props.data)}
        >
            <Image
                className="rounded-[50%]"
                src={props.data.avatar !== null ? props.data.avatar : avatarTest}
                alt='test'
                width={48}
                height={48}
            />

            <div
                className="w-[268px] hover:cursor-pointer"
            >
                <div
                    className="w-[268px] flex flex-row items-center"
                >
                    <p className="w-[80%] text-richBlack text-[16px] font-semibold not-italic
                    leading-[20px] ">
                        {props.data.displayName}
                    </p>
                    <p className="text-navyGrey">18.02</p>
                </div>

                <div
                    className="flex flex-row items-center"
                >
                    <p className="w-[90%] text-navyGrey" > I got a job at SpaceX 🎉 🚀  </p>
                    <div className="w-[18px] h-[18px] flex justify-center items-center 
                    rounded-[100px] bg-[#78E378] text-white text-[12px] font-normal leading-4 not-italic"
                    >
                        2
                    </div>
                </div>
            </div>
        </div>
    )
}
