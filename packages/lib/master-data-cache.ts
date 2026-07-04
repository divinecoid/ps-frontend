import { Fabric } from "@/interfaces/fabric";
import { ModelSize } from "@/interfaces/model-size";
import Services from "@/services";

const resolvedModelSizes = new Map<string, ModelSize[]>();
const inflightModelSizes = new Map<string, Promise<ModelSize[]>>();

let uncutFabricsResolved: Fabric[] | null = null;
let uncutFabricsInflight: Promise<Fabric[]> | null = null;

export function getCachedModelSizes(modelId: string): ModelSize[] | undefined {
    return resolvedModelSizes.get(modelId);
}

export function fetchModelSizes(modelId: string): Promise<ModelSize[]> {
    const cached = resolvedModelSizes.get(modelId);
    if (cached) return Promise.resolve(cached);

    const inflight = inflightModelSizes.get(modelId);
    if (inflight) return inflight;

    const promise = Services.MasterProductModel.model_size(modelId)
        .then(res => {
            if (!res.ok) throw new Error("Gagal memuat ukuran model.");
            return res.json();
        })
        .then(json => json.data as ModelSize[])
        .then(data => {
            resolvedModelSizes.set(modelId, data);
            inflightModelSizes.delete(modelId);
            return data;
        })
        .catch(err => {
            inflightModelSizes.delete(modelId);
            throw err;
        });

    inflightModelSizes.set(modelId, promise);
    return promise;
}

export function prefetchModelSizes(modelIds: string[]): void {
    const unique = [...new Set(modelIds.filter(Boolean))];
    unique.forEach(id => {
        fetchModelSizes(id).catch(() => undefined);
    });
}

export function fetchUncutFabrics(force = false): Promise<Fabric[]> {
    if (force) {
        uncutFabricsResolved = null;
    }
    if (uncutFabricsResolved) return Promise.resolve(uncutFabricsResolved);
    if (uncutFabricsInflight) return uncutFabricsInflight;

    uncutFabricsInflight = Services.MasterFabric.uncut()
        .then(res => {
            if (!res.ok) throw new Error("Gagal memuat daftar kain.");
            return res.json();
        })
        .then(json => json.data as Fabric[])
        .then(data => {
            uncutFabricsResolved = data;
            uncutFabricsInflight = null;
            return data;
        })
        .catch(err => {
            uncutFabricsInflight = null;
            throw err;
        });

    return uncutFabricsInflight;
}


export function fetchAllFabrics(force = false): Promise<Fabric[]> {
    if (force) {
        uncutFabricsResolved = null;
    }
    if (uncutFabricsResolved) return Promise.resolve(uncutFabricsResolved);
    if (uncutFabricsInflight) return uncutFabricsInflight;

    uncutFabricsInflight = Services.MasterFabric.master()
        .then(res => {
            if (!res.ok) throw new Error("Gagal memuat daftar kain.");
            return res.json();
        })
        .then(json => json.data as Fabric[])
        .then(data => {
            uncutFabricsResolved = data;
            uncutFabricsInflight = null;
            return data;
        })
        .catch(err => {
            uncutFabricsInflight = null;
            throw err;
        });

    return uncutFabricsInflight;
}
