"use client";

import { ReactNode, createContext, useState } from "react";

interface AppContextType {
    isSpeaking : boolean;
    setIsSpeaking: React.Dispatch<React.SetStateAction<boolean>>
}

export const AppContext = createContext<AppContextType>({
    isSpeaking: false,
    setIsSpeaking: () => {},
});

export default function IsSpeakingContext({children} : {children : ReactNode}){
    const [isSpeaking, setIsSpeaking] = useState(false);

    return (
        <AppContext.Provider
            value={{isSpeaking, setIsSpeaking}}
        >
            {children}
        </AppContext.Provider>
    );
}