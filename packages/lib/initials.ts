export function initials(s?: string) {
    if (s === undefined) {
        return undefined;
    }
    const w = s.trim().split(/\s+/);
    return (w.length === 1 ? w[0][0] : w[0][0] + w.at(-1)![0]).toUpperCase();
};