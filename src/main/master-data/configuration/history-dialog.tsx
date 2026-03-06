import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConfigurationHistory } from "@/interfaces/configuration";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as MasterConfiguration from "@/services/master-configuration";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface HistoryDialogProps {
    id?: string;
    setId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function HistoryDialog({ id, setId }: HistoryDialogProps) {
    const [histories, setHistories] = useState<ConfigurationHistory[]>([]);
    const [configKey, setConfigKey] = useState<string>("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const res = await MasterConfiguration.show(id);
                const json = await res.json();
                if (res.ok) {
                    setHistories(json.data.histories ?? []);
                    setConfigKey(json.data.config_key ?? "");
                } else {
                    toast.error(json.message, { richColors: true });
                    setId(undefined);
                }
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message, { richColors: true });
                }
                setId(undefined);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Dialog open={!!id} onOpenChange={(open) => { if (!open) setId(undefined); }}>
            <DialogContent className={`flex flex-col max-h-[80vh] p-0 select-none ${loading ? 'cursor-progress' : ''}`}>
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle>Riwayat Perubahan</DialogTitle>
                    <DialogDescription>
                        Riwayat perubahan nilai untuk <span className="font-mono font-semibold">{configKey}</span>
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-1 overflow-y-auto px-6 pb-6">
                    {histories.length === 0 && !loading ? (
                        <div className="text-center text-muted-foreground py-8 text-sm">
                            Belum ada riwayat perubahan.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {histories.map((h) => (
                                <div key={h.id} className="rounded-lg border p-3 space-y-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Badge variant="outline" className="font-mono">{h.old_value || '(kosong)'}</Badge>
                                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                                        <Badge variant="secondary" className="font-mono">{h.new_value || '(kosong)'}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>Oleh: <span className="font-medium text-foreground">{h.changed_by?.name ?? "Sistem"}</span></span>
                                        <span>{formatDate(h.changed_at)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
