"use client"
import { createContext, useContext, useState, ReactNode } from 'react';
import { msgInfo, userInfo } from '../utils/types';

// interface WalletContextType {
//     user : userInfo;
//     setUser: (value: userInfo)=> void;


// }
// const walletContext = createContext<WalletContextType | undefined> ;

// export default walletContext;

const UserContext = createContext({
    user: {} as userInfo,
    setUser: (value: userInfo) => { },
    login: false,
    setLogin: (value: boolean) => { },
    isLoading: false,
    setIsLoading: (value: boolean) => { },
    imageUrl: '/upload-bg.png',
    setImageUrl: (value: string) => { },
    isCreated: false,
    setIsCreated: (value: boolean) => { },
    messages: [] as msgInfo[],
    setMessages: (value: msgInfo[]) => { },
    coinId: "",
    setCoinId: (value: string) => { },
    newMsg: {} as msgInfo,
    setNewMsg: (value: msgInfo) => { },
})

export default UserContext;