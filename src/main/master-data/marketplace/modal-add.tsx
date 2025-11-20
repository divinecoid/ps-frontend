import ModalAddItem from "@/components/custom/add-item";
import Services from "@/services";
import { z } from "zod/v3";

export default function ModalAddMarketplace({ id }: { id?: string }) {
    return <ModalAddItem
        title="Add Marketplace"
        description="Add new marketplace"
        onCreate={Services.MasterMarketplace.store}
        onUpdate={Services.MasterMarketplace.update}
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
        ]} />
}