import ModalItem from "@/components/custom/modal-item";
import { BaseForm } from "@/interfaces/base";
import { User } from "@/interfaces/user";
import { z } from "zod/v3";

export default function ModalUser(props: BaseForm) {
    return <ModalItem<User>
        title={props.isEdit ? "Edit User" : "Add User"}
        description={props.isEdit ? "Edit User" : "Add new User"}
        {...props}
        formShape={[
            {
                key: "name",
                type: "text",
                schema: z.string(),
                label: "Name",
                description: "Input User's name.",
                placeholder: "User name",
            },
            {
                key: "username",
                type: "text",
                schema: z.string(),
                label: "Name",
                description: "Input User's username.",
                placeholder: "Username",
            },
            {
                key: "email",
                type: "text",
                schema: z.string(),
                label: "Name",
                description: "Input User's email.",
                placeholder: "User email",
            },
            {//TODO: combobox multiselect
                key: "name",
                type: "text",
                schema: z.string(),
                label: "Name",
                description: "Input User's name.",
                placeholder: "User name",
            },
        ]} />
}