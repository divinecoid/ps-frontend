import { ModelSize } from "@/interfaces/model-size";
import { fetchModelSizes, getCachedModelSizes } from "@/lib/master-data-cache";
import React from "react";

export function useModelSizes(modelId: string | undefined, enabled = true): ModelSize[] {
    const [sizes, setSizes] = React.useState<ModelSize[]>(() =>
        modelId && enabled ? getCachedModelSizes(modelId) ?? [] : []
    );

    React.useEffect(() => {
        if (!modelId || !enabled) {
            setSizes([]);
            return;
        }

        const cached = getCachedModelSizes(modelId);
        if (cached) {
            setSizes(cached);
            return;
        }

        let cancelled = false;
        fetchModelSizes(modelId)
            .then(data => {
                if (!cancelled) setSizes(data);
            })
            .catch(() => {
                if (!cancelled) setSizes([]);
            });

        return () => {
            cancelled = true;
        };
    }, [modelId, enabled]);

    return sizes;
}
