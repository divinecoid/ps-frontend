import ModalItem from "@/components/custom/modal-item"
import { BaseForm } from "@/interfaces/base"
import { OnlineStore } from "@/interfaces/online-store"
import Services from "@/services"
import { z } from "zod/v3"

export default function ModalOnlineStore({ onSubmit, isEdit, id, setId }: BaseForm) {
    return <ModalItem<OnlineStore>
        title={isEdit ? "Edit Online Store" : "Add Online Store"}
        description={isEdit ? "Edit Online Store" : "Add new online store"}
        services={Services.MasterOnlineStore}
        isEdit={isEdit}
        id={id}
        setId={setId}
        afterSubmit={onSubmit}
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
                placeholder: "MKP-001",
            },
            {
                key: "store_code",
                type: "text",
                schema: z.string().min(2, {
                    message: "Store code must be at least 2 characters."
                }),
                label: "Store code",
                description: "Input online store's code.",
                placeholder: "OLS-001",
            },
            {
                key: "store_name",
                type: "text",
                schema: z.string().min(2, {
                    message: "Store name must be at least 2 characters."
                }),
                label: "Store name",
                description: "Input online store's name.",
                placeholder: "Online store's name",
            },
            {
                key: "api_key",
                type: "text",
                schema: z.string().min(2, {
                    message: "Api key must be at least 2 characters."
                }),
                label: "API key",
                description: "Input online store's API key.",
                placeholder: "1020281",
            },
            {
                key: "client_id",
                type: "text",
                schema: z.string().min(2, {
                    message: "Client id must be at least 2 characters."
                }),
                label: "Client id",
                description: "Input online store's name.",
                placeholder: "qwawjd-9f3101-31n1w1-dq0apw",
            },
            {
                key: "client_secret",
                type: "text",
                schema: z.string().min(2, {
                    message: "Client secret must be at least 2 characters."
                }),
                label: "Client secret",
                description: "Input online store's client secret.",
                placeholder: "09ewiOhihajkAOpasmQU12BE2902adwj2",
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
                placeholder: "https://www.example.com/officialstore",
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
                placeholder: "https://www.example.com/callback?",
            },
        ]} />
}