import ModalItem from "@/components/custom/modal-item";
import { BaseModalForm } from "@/interfaces/base";
import { Role } from "@/interfaces/role";
import { z } from "zod/v3";

export default function ModalRole(props: BaseModalForm) {
    return <ModalItem<Role>
        title={props.isEdit ? "Edit Role" : "Add Role"}
        description={props.isEdit ? "Edit Role" : "Add new Role"}
        {...props}
        formShape={[
            {
                key: "name",
                type: "text",
                schema: z.string(),
                label: "Name",
                description: "Input Role's name.",
                placeholder: "Role name",
            },
            {
                key: "description",
                type: "text",
                schema: z.string(),
                label: "Description",
                description: "Input Role's description.",
                placeholder: "Role description",
            },
        ]} />
}