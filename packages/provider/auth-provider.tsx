import Services, { setTokenRefreshListener } from "@/services";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface AuthContextType {
    token: string | null | undefined;
    login: (user: string, pass: string) => Promise<boolean>;
    logout: () => Promise<boolean>;
}

interface AuthProviderProps {
    initialToken?: string | null;
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ initialToken, children }: AuthProviderProps) {
    const [token, setToken] = useState<string | null | undefined>(initialToken);

    const login = async (user: string, pass: string) => {
        const result = await Services.Auth.login(user, pass);
        if (result.ok) {
            const json = await result.json();
            const token = json["token"];
            const refresh_token = json["refresh_token"];
            await window.electronAPI.saveToken(token);
            await window.electronAPI.saveRefreshToken(refresh_token);
            setToken(token);
            return true;
        } else {
            const json = await result.json();
            toast.error(json.message, { richColors: true })
        }
        return false;
    };

    const logout = async () => {
        const result = await Services.Auth.logout();
        if (result.ok) {
            setToken(undefined);
            return true;
        }
        return false;
    };

    useEffect(() => {
        const listener = (newToken: string) => {
            setToken((oldToken) => (oldToken !== newToken ? newToken : oldToken));
        };
        setTokenRefreshListener(listener);
        return () => {
            setTokenRefreshListener(null);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
};
