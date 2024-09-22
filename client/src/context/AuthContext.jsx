import { createContext, useState } from "react";

const authContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components, react/prop-types
const AuthProvider = ({ children }) => {
    // State to track user authentication
    const [token, setToken] = useState(localStorage.getItem('token'));
    return (
        <authContext.Provider value={{ token, setToken }}>
            {children}
        </authContext.Provider>
    );
    
}

export {  AuthProvider,authContext };