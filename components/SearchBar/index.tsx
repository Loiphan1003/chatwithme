import React, { useContext, useEffect, useState } from 'react';
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from '@chakra-ui/react'
import Image from 'next/image';
import { AuthContext } from '@/context/AuthContext';
import useDebounce from '@/hooks/useDebounce';
import { findNameAccount, handleSelectChat } from '@/utils/firestore';
import AvatarTest from '../../assets/images/Avatar.png';
import { Backdrop } from '../Backdrop';
import { AccountType } from '@/types';
import { ChatContext } from '@/context/ChatContext';


const menus = ["Log out"];

const SearchBar = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [resultSearchTerm, setResultSearchTerm] = useState<any[]>([]);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const { currentUser, logout } = useContext(AuthContext);
    const { handleClear } = useContext(ChatContext);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }

    const handleSearch = () => {
        const res = debouncedSearchTerm;
        console.log(res);
    }

    const handleCloseShowSearchList = () => {
        setSearchTerm('');
        setResultSearchTerm([]);
    }

    const handleSelect = (user: AccountType) => {
        const combinedId = currentUser?.uid > user.uid
            ? currentUser.uid + user.uid
            : user.uid + currentUser.uid;

        handleSelectChat(combinedId, currentUser, user);
        handleCloseShowSearchList();
    }

    const handleLogout = () => {
        logout();
        handleClear();
    }


    useEffect(() => {
        if (debouncedSearchTerm) {
            if (currentUser.uid === null) return;
            findNameAccount(searchTerm, currentUser.uid)
                .then((res) => {
                    setResultSearchTerm(res);
                });
        }
    }, [debouncedSearchTerm])


    return (
        <React.Fragment>
            <div
                className="px-4 py-2 flex flex-row gap-6 items-center "
            >
                <Menu>
                    <MenuButton >
                        <div
                            className="h-6 hover:cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M2.99999 17H21C21.2549 17.0003 21.5 17.0979 21.6854 17.2728C21.8707 17.4478 21.9822 17.687 21.9972 17.9414C22.0121 18.1958 21.9293 18.4464 21.7657 18.6418C21.6021 18.8373 21.3701 18.9629 21.117 18.993L21 19H2.99999C2.74511 18.9997 2.49996 18.9021 2.31462 18.7272C2.12929 18.5522 2.01776 18.313 2.00282 18.0586C1.98788 17.8042 2.07067 17.5536 2.23426 17.3582C2.39785 17.1627 2.62989 17.0371 2.88299 17.007L2.99999 17H21H2.99999ZM2.99999 11L21 10.998C21.2549 10.9983 21.5 11.0959 21.6854 11.2708C21.8707 11.4458 21.9822 11.685 21.9972 11.9394C22.0121 12.1938 21.9293 12.4444 21.7657 12.6398C21.6021 12.8353 21.3701 12.9609 21.117 12.991L21 12.998L2.99999 13C2.74511 12.9997 2.49996 12.9021 2.31462 12.7272C2.12929 12.5522 2.01776 12.313 2.00282 12.0586C1.98788 11.8042 2.07067 11.5536 2.23426 11.3582C2.39785 11.1627 2.62989 11.0371 2.88299 11.007L2.99999 11L21 10.998L2.99999 11ZM2.99999 5H21C21.2549 5.00028 21.5 5.09788 21.6854 5.27285C21.8707 5.44782 21.9822 5.68695 21.9972 5.94139C22.0121 6.19584 21.9293 6.44638 21.7657 6.64183C21.6021 6.83729 21.3701 6.9629 21.117 6.993L21 7H2.99999C2.74511 6.99972 2.49996 6.90212 2.31462 6.72715C2.12929 6.55218 2.01776 6.31305 2.00282 6.05861C1.98788 5.80416 2.07067 5.55362 2.23426 5.35817C2.39785 5.16271 2.62989 5.0371 2.88299 5.007L2.99999 5H21H2.99999Z" fill="#707991" />
                            </svg>
                        </div>
                    </MenuButton>
                    <MenuList
                        className="bg-white w-200px border border-black rounded-lg
                        flex flex-col gap-2"
                    >
                        <MenuItem 
                            className="px-2 pt-2 box-border"
                        >
                            {currentUser.avatar !== null &&
                                <Image
                                    className="rounded-[50%]"
                                    src={currentUser.avatar}
                                    alt='Avatar'
                                    width={42}
                                    height={42}
                                />
                            }
                            <p className="ml-2" >{currentUser.displayName}</p>
                        </MenuItem>

                        <MenuItem
                            className="px-2 pb-1 box-border" 
                            onClick={() => handleLogout()}
                        >
                            Log out
                        </MenuItem>
                    </MenuList>
                </Menu>

                <div
                    className="w-auto h-auto px-4 py-2 flex flex-row items-center gap-4 rounded-[22px] bg-[#F5F5F5]
                    relative"
                >
                    <div
                        className="hover:cursor-pointer"
                        onClick={() => handleSearch()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9.99997 2.5C11.3979 2.49994 12.7681 2.89061 13.9559 3.62792C15.1436 4.36523 16.1016 5.41983 16.7218 6.6727C17.342 7.92558 17.5997 9.32686 17.4658 10.7184C17.3319 12.11 16.8117 13.4364 15.964 14.548L20.707 19.293C20.8863 19.473 20.9904 19.7144 20.9982 19.9684C21.006 20.2223 20.9168 20.4697 20.7487 20.6603C20.5807 20.8508 20.3464 20.9703 20.0935 20.9944C19.8406 21.0185 19.588 20.9454 19.387 20.79L19.293 20.707L14.548 15.964C13.601 16.6861 12.4956 17.1723 11.3234 17.3824C10.1512 17.5925 8.9458 17.5204 7.80697 17.1721C6.66814 16.8238 5.62862 16.2094 4.77443 15.3795C3.92023 14.5497 3.27592 13.5285 2.8948 12.4002C2.51368 11.2719 2.40672 10.0691 2.58277 8.89131C2.75881 7.7135 3.2128 6.59454 3.90717 5.62703C4.60153 4.65951 5.51631 3.87126 6.57581 3.32749C7.63532 2.78372 8.80908 2.50006 9.99997 2.5ZM9.99997 4.5C8.54128 4.5 7.14233 5.07946 6.11088 6.11091C5.07943 7.14236 4.49997 8.54131 4.49997 10C4.49997 11.4587 5.07943 12.8576 6.11088 13.8891C7.14233 14.9205 8.54128 15.5 9.99997 15.5C11.4587 15.5 12.8576 14.9205 13.8891 13.8891C14.9205 12.8576 15.5 11.4587 15.5 10C15.5 8.54131 14.9205 7.14236 13.8891 6.11091C12.8576 5.07946 11.4587 4.5 9.99997 4.5Z" fill="#707991" />
                        </svg>
                    </div>
                    <input
                        className="h-5 bg-[#F5F5F5] focus:outline-none"
                        type="text"
                        placeholder='Search'
                        onChange={handleSearchChange}
                        value={searchTerm}
                    />

                    {resultSearchTerm.length > 0 &&
                        <div
                            className="absolute top-[50px] left-0 w-full h-[100px] 
                        flex flex-col rounded bg-white border z-[11]"
                        >
                            {resultSearchTerm.map((i: AccountType) => (
                                <div
                                    key={i.uid}
                                    className="px-1 pt-[4px] box-border flex flex-row 
                                    items-center gap-1 hover:cursor-pointer"
                                    onClick={() => handleSelect(i)}
                                >
                                    <Image
                                        className="rounded-[50%]"
                                        src={i.avatar !== null ? i.avatar : AvatarTest}
                                        alt='avatar'
                                        width={48}
                                        height={48}
                                    />

                                    <p>{i.displayName}</p>
                                </div>
                            ))}
                        </div>
                    }
                </div>
            </div>
            {resultSearchTerm.length > 0 && <Backdrop handleClick={() => handleCloseShowSearchList()} />}

        </React.Fragment>
    )
}

export default SearchBar;
