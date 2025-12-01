import { jwtDecode, JwtPayload } from "jwt-decode";

interface TokenData extends JwtPayload {
    name?: string,
    email?: string,
    roles?: string[]
}
const decodeToken = (token: string | null) => {
    try {
        if (!token) return null;
        return jwtDecode<TokenData>(token);
    } catch {
        return null;
    }
};

export const hasRole = (token: string, role: string) => {
    const decoded = decodeToken(token);
    if (!decoded?.roles) return false;

    return decoded.roles
        .map((r) => r.toLowerCase())
        .includes(role.toLowerCase());
};
