import ModalItem from "@/components/custom/modal-item";
import { BaseForm } from "@/interfaces/base";
import { Marketplace } from "@/interfaces/marketplace";
import { z } from "zod/v3";

export default function ModalMarketplace(props: BaseForm) {
    return <ModalItem<Marketplace>
        title={props.isEdit ? "Edit Marketplace" : "Add Marketplace"}
        description={props.isEdit ? "Edit Marketplace" : "Add new marketplace"}
        {...props}
        formShape={[
            {
                key: "code",
                type: "text",
                schema: z.string().min(2, {
                    message: "Code must be at least 2 characters.",
                }),
                label: "Code",
                description: "Input marketplace's code.",
                placeholder: "MKP-001",
            },
            {
                key: "name",
                type: "text",
                schema: z.string(),
                label: "Name",
                description: "Input marketplace's name.",
                placeholder: "Marketplace name",
            },
            {
                key: "base_api_url",
                type: "text",
                schema: z.string().url({
                    message: "Base API URL not valid"
                }).min(2, {
                    message: "Base API URL must be at least 2 characters."
                }),
                label: "Base API URL",
                description: "Input marketplace's base API URL.",
                placeholder: "https://api.example.com/rest",
            },
            {
                key: "description",
                type: "textarea",
                schema: z.string(),
                label: "Description",
                description: "Input marketplace's description.",
                placeholder: "Marketplace description",
            },
            {
                key: "is_need_checker",
                type: "switch",
                schema: z.coerce.boolean(),
                label: "Need checker",
                description: "Is marketplace need checker.",
                placeholder: "Marketplace need checker state",
            },
        ]} />
}