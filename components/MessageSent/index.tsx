"use client"
import { Timestamp } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react'

interface MessageSendProps {
    type: string,
    text: string,
    time: any,
}

export const MessageSent = (props: MessageSendProps) => {

    const [time, setTime] = useState('');

    const handleChangeStyle = () => {
        let styles: string = "w-auto flex-col ";
        if (props.type === 'send') styles += "flex items-end";
        return styles;
    }

    const handleChangeTimeStyle = () => {
        let styles: string = "text-[12px] not-italic font-normal leading-4";
        if (props.type === 'send') return styles += "text-white";
        return styles += "text-richBlack";
    }

    const handleFormatTypeTimeSend = useCallback( () => {
        const timestamp: any = props.time;
        const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const t = `${hours}:${minutes}`
        setTime(t);
    }, [time])

    useEffect(() => {
        handleFormatTypeTimeSend()
    }, [handleFormatTypeTimeSend])
    

    return (
        <div
            className={handleChangeStyle()}
        >
            <div
                className={props.type === 'send' ?
                    "mt-[24px] max-w-[378px] w-fit bg-lightGreen px-[12px] py-[4px] box-border rounded-[12px] flex flex-col gap-[4px]" :
                    "mt-[24px] bg-white max-w-[378px] w-fit rounded-[12px] px-[12px] py-[4px]"}

            >
                <p
                    className="text-[16px] text-richBlack not-italic font-normal leading-5"
                >
                    {props.text}
                </p>

                <div
                    className="w-[100%] flex flex-row justify-end"
                >
                    <p
                        className={handleChangeTimeStyle()}
                    >
                        {time}
                    </p>
                </div>
            </div>
        </div>
    )
}
