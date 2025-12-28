import ModalItem from "@/components/custom/modal-item";
import { BaseModalForm } from "@/interfaces/base";
import { User } from "@/interfaces/user";
import Services from "@/services";
import { z } from "zod/v3";

export default function ModalUser(props: BaseModalForm) {
    return <ModalItem<User>
        title={props.isEdit ? "Edit User" : "Add User"}
        description={props.isEdit ? "Edit User" : "Add new User"}
        {...props}
        formShape={[
            {
                key: "name",
                type: "text",
                schema: z.string().nonempty("Name is required"),
                label: "Name",
                description: "Input User's name.",
                placeholder: "User name",
            },
            {
                key: "username",
                type: "text",
                schema: z.string().nonempty("Username is required"),
                label: "Username",
                description: "Input User's username.",
                placeholder: "Username",
            },
            {
                key: "email",
                type: "text",
                schema: z.string().nonempty("Email is required"),
                label: "Email",
                description: "Input User's email.",
                placeholder: "User email",
            },
            {
                key: "password",
                type: "password",
                passwordEdit: props.isEdit,
                schema: props.isEdit ? z.string().optional() : z.string().nonempty("Password is required"),
                label: "Password",
                description: "Input User's password.",
                placeholder: "User password",
            },
            {
                key: "role_id",
                type: "multi-combobox",
                schema: z.array(z.string()).nonempty({
                    message: "Role is required"
                }),
                source: {
                    api: Services.MasterRole.index,
                    id: "id",
                    label: "name"
                },
                label: "Role",
                description: "Input User's roles.",
                placeholder: "User roles",
            },
        ]} />
}