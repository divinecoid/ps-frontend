import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth-provider";
import { decodeToken, hasRole } from "@/lib/jwt-decode";
import Services from "@/services";

interface AcmContextType {
    permissions: Record<string, {
        can_create: boolean;
        can_read: boolean;
        can_update: boolean;
        can_delete: boolean;
        can_force_delete: boolean;
    }>;
    loading: boolean;
    isAdmin: boolean;
}

const AcmContext = createContext<AcmContextType | null>(null);

export function AcmProvider({ children }: { children: React.ReactNode }) {
    const { token } = useAuth();
    const [permissions, setPermissions] = useState<Record<string, {
        can_create: boolean;
        can_read: boolean;
        can_update: boolean;
        can_delete: boolean;
        can_force_delete: boolean;
    }>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    useEffect(() => {
        if (!token) {
            setPermissions({});
            setLoading(false);
            setIsAdmin(false);
            return;
        }

        const admin = hasRole(token, "admin");
        setIsAdmin(admin);

        if (admin) {
            setPermissions({});
            setLoading(false);
            return;
        }

        const fetchAcm = async () => {
            setLoading(true);
            try {
                const decoded = decodeToken(token);
                if (!decoded || !decoded.roles || decoded.roles.length === 0) {
                    setPermissions({});
                    setLoading(false);
                    return;
                }

                // 1. Fetch all roles to map role names to role IDs
                const roleRes = await Services.MasterRole.master(1, 999, "", "");
                if (!roleRes.ok) {
                    setPermissions({});
                    setLoading(false);
                    return;
                }
                const roleJson = await roleRes.json();
                const rolesList = roleJson.data ?? [];

                // Find user's role IDs
                const userRoleNames = decoded.roles.map(r => r.toLowerCase());
                const matchedRoles = rolesList.filter((r: any) => userRoleNames.includes(r.name.toLowerCase()));
                
                if (matchedRoles.length === 0) {
                    setPermissions({});
                    setLoading(false);
                    return;
                }

                // 2. Fetch permissions for each role ID
                const allRolePermsPromises = matchedRoles.map(async (role: any) => {
                    try {
                        const permRes = await Services.Acm.getByRole(role.id);
                        if (permRes.ok) {
                            const json = await permRes.json();
                            if (json.success) {
                                return json.data.permissions;
                            }
                        }
                    } catch (e) {
                        console.error(`Error loading permissions for role ${role.id}:`, e);
                    }
                    return [];
                });

                const allPermsList = await Promise.all(allRolePermsPromises);

                // 3. Merge permissions using OR logic
                const merged: Record<string, {
                    can_create: boolean;
                    can_read: boolean;
                    can_update: boolean;
                    can_delete: boolean;
                    can_force_delete: boolean;
                }> = {};

                allPermsList.forEach(perms => {
                    if (!perms) return;
                    perms.forEach((p: any) => {
                        if (!merged[p.menu_key]) {
                            merged[p.menu_key] = {
                                can_create: false,
                                can_read: false,
                                can_update: false,
                                can_delete: false,
                                can_force_delete: false,
                            };
                        }
                        merged[p.menu_key].can_create = merged[p.menu_key].can_create || !!p.can_create;
                        merged[p.menu_key].can_read = merged[p.menu_key].can_read || !!p.can_read;
                        merged[p.menu_key].can_update = merged[p.menu_key].can_update || !!p.can_update;
                        merged[p.menu_key].can_delete = merged[p.menu_key].can_delete || !!p.can_delete;
                        merged[p.menu_key].can_force_delete = merged[p.menu_key].can_force_delete || !!p.can_force_delete;
                    });
                });

                setPermissions(merged);
            } catch (err) {
                console.error("Error fetching ACM permissions:", err);
                setPermissions({});
            } finally {
                setLoading(false);
            }
        };

        fetchAcm();
    }, [token]);

    return (
        <AcmContext.Provider value={{ permissions, loading, isAdmin }}>
            {children}
        </AcmContext.Provider>
    );
}

export function useAcm(menuKey: string) {
    const context = useContext(AcmContext);
    if (!context) {
        throw new Error("useAcm must be used inside AcmProvider");
    }

    const { permissions, loading, isAdmin } = context;

    // Admin always gets all permissions (bypass)
    if (isAdmin) {
        return {
            canCreate: true,
            canRead: true,
            canUpdate: true,
            canDelete: true,
            canForceDelete: true,
            loading: false,
        };
    }

    const perm = permissions[menuKey];
    return {
        canCreate: perm ? perm.can_create : false,
        canRead: perm ? perm.can_read : false,
        canUpdate: perm ? perm.can_update : false,
        canDelete: perm ? perm.can_delete : false,
        canForceDelete: perm ? perm.can_force_delete : false,
        loading,
    };
}
