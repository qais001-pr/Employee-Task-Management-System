import React, { useContext, createContext, useState } from "react";

export const AuthContext = createContext({
    user: undefined,
    login: () => { },
    logout: () => { },
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(undefined);

    const login = (userData) => { setUser(userData) };

    const logout = () => setUser(undefined);

    const contextValue = {
        user,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); 
