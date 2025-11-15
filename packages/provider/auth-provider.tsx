import { Auth } from "@/services";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ initialToken, children }) {
    const [token, setToken] = useState(initialToken);

    const login = async (user: string, pass: string) => {
        const result = await Auth.login(user, pass);
        if (result.ok) {
            const json = await result.json();
            const token = json["token"];
            const refresh_token = json["refresh_token"];
            await window.electronAPI.saveToken(token);
            await window.electronAPI.saveRefreshToken(refresh_token);
            setToken(token);
            return true;
        }
        return false;
    };

    const logout = async () => {
        await Auth.logout();
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
