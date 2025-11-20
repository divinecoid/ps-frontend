import ModalAddItem from "@/components/custom/add-item";
import { OnlineStore } from "@/interfaces/online-store";
import Services from "@/services";
import { z } from "zod/v3";

export default function ModalAddOnlineStore({ id }: { id?: string }) {
    return <ModalAddItem<OnlineStore>
        title="Add Online Store"
        description="Add new online store"
        onCreate={Services.MasterOnlineStore.store}
        onUpdate={Services.MasterOnlineStore.update}
        formShape={[
            {
                key: "marketplace_id",
                type: "combobox",
                schema: z.string().nonempty({
                    message: "Marketplace is required.",
                }),
                source: {
                    id: "id",
                    label: "name",
                    api: Services.MasterMarketplace.index
                },
                label: "Marketplace",
                description: "Input online store's marketplace.",
                placeholder: "Online store's marketplace",
            },
            {
                key: "store_code",
                type: "text",
                schema: z.string().min(2, {
                    message: "Store code must be at least 2 characters."
                }),
                label: "Store code",
                description: "Input online store's code.",
                placeholder: "Online store code",
            },
            {
                key: "store_name",
                type: "text",
                schema: z.string().min(2, {
                    message: "Store name must be at least 2 characters."
                }),
                label: "Store name",
                description: "Input online store's name.",
                placeholder: "Online store name",
            },
            {
                key: "api_key",
                type: "text",
                schema: z.string().min(2, {
                    message: "Api key must be at least 2 characters."
                }),
                label: "API key",
                description: "Input online store's API key.",
                placeholder: "Online store's API key",
            },
            {
                key: "client_id",
                type: "text",
                schema: z.string().min(2, {
                    message: "Client id must be at least 2 characters."
                }),
                label: "Client id",
                description: "Input online store's name.",
                placeholder: "Online store's name",
            },
            {
                key: "client_secret",
                type: "text",
                schema: z.string().min(2, {
                    message: "Client secret must be at least 2 characters."
                }),
                label: "Client secret",
                description: "Input online store's client secret.",
                placeholder: "Online store's client secret",
            },
            {
                key: "store_url",
                type: "text",
                schema: z.string().url({
                    message: "Store URL not valid"
                }).min(2, {
                    message: "Store URL must be at least 2 characters."
                }),
                label: "Store URL",
                description: "Input online store's URL.",
                placeholder: "Online store's URL",
            },
            {
                key: "is_active",
                type: "switch",
                schema: z.boolean(),
                label: "Is active",
                description: "Online store's state.",
                placeholder: "Online store's state",
            },
            {
                key: "redirect_uri",
                type: "text",
                schema: z.string().url({
                    message: "Redirect URL not valid"
                }).min(2, {
                    message: "Redirect URL must be at least 2 characters."
                }),
                label: "Redirect URL",
                description: "Input online store's redirect URL.",
                placeholder: "Online store's redirect URL",
            },
        ]} />
}