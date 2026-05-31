import { GET, POST } from "./api";
import { ENDPOINT } from "./endpoints";

export interface AcmPermission {
    menu_key: string;
    label: string;
    applicable: string[];
    can_create: boolean;
    can_read: boolean;
    can_update: boolean;
    can_delete: boolean;
}

export const getByRole = async (roleId: string) => {
    return await GET(`${ENDPOINT.ACM}/${roleId}`);
};

export const upsert = async (roleId: string, permissions: Omit<AcmPermission, 'label' | 'applicable'>[]) => {
    return await POST(`${ENDPOINT.ACM}/${roleId}`, { permissions });
};
