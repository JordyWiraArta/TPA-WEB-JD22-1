import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

export const searchContext = createContext<any>({});

export const SearchProvider: React.FC<{children:any}> = ({children}) => {
    const [search, setSearch] = useState("");
    const [isSearch, setIsSearch] = useState(false);

    return <searchContext.Provider value={{search, setSearch, isSearch, setIsSearch}}>
        {children}
    </searchContext.Provider>
}

