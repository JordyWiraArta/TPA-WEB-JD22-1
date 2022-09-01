import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";

export const authContext = createContext<any>({});

export const AuthProvider: React.FC<{children:any}> = ({children}) => {
    const [user, setUser] = useState(null);

    return <authContext.Provider value={{user, setUser}}>
        {children}
    </authContext.Provider>
}

