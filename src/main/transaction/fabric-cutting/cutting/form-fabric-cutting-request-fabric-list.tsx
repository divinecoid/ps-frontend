import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import FabricListItem from './form-fabric-cutting-request-fabric-list-item';
import React from "react";
import { Fabric } from "@/interfaces/fabric";
import ConfirmDetail from "./form-fabric-cutting-request-detail-confirm";
import { fetchUncutFabrics } from "@/lib/master-data-cache";
import { Card, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FabricProps {
    rowKey: string;
    disabled?: boolean;
}
export default function FabricCuttingRequestFabricList({
    rowKey,
    disabled,
}: FabricProps) {
    const form = useFormContext();
    const [fabrics, setFabrics] = React.useState<Fabric[]>([]);

    const fabricOptions = React.useMemo(
        () => fabrics.map(s => ({ id: s.id, name: s.sequence })),
        [fabrics]
    );

    const [deleteIndex, setDeleteIndex] = React.useState<number | undefined>();

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: rowKey,
    });

    const handleAddFabric = () => {
        append({
            fabric_id: undefined,
            quantity: "",
        });
    };

    React.useEffect(() => {
        fetchUncutFabrics()
            .then(setFabrics)
            .catch(() => setFabrics([]));
    }, []);

    return (
        <>
            <ConfirmDetail index={deleteIndex} setIndex={setDeleteIndex} action={remove} variant="destructive" title="Apakah anda yakin untuk menghapus ini?" description="Aksi ini akan menghapus ukuran terpilih secara permanen!" />

            <div className="flex my-2">
                <FormLabel className="flex-1 py-3">Kain</FormLabel>
                {!disabled && (
                    <Button type="button" variant="default" onClick={() => handleAddFabric()}><Plus />Tambah kain</Button>
                )}
            </div>
            <FormField
                control={form.control}
                name={rowKey}
                render={() => (

                    <Card className={cn("shadow-none bg-secondary p-2 gap-2", (form.formState.errors[rowKey]?.message || form.formState.errors?.[rowKey]?.root?.message) && "border-destructive bg-destructive/10")}>
                        {fields.length == 0 && <CardDescription className="text-center col-span-2 h-full m-4">Daftar kain Anda masih kosong, silahkan tekan tambah kain yang akan dipotong!</CardDescription>}
                        {fields.map((row, index) => (
                            <Card className="flex flex-col gap-2 p-4" key={row.id}>
                                <FabricListItem
                                    control={form.control}
                                    index={index}
                                    rowKey={rowKey}
                                    handleRemove={setDeleteIndex}
                                    fabrics={fabricOptions}
                                    disabled={disabled}
                                />
                            </Card>
                        ))}

                    </Card>

                )}
            />
        </>
    );
}