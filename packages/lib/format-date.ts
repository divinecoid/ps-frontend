export function formatDateTime(date: Date) {
    return new Date(date).toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}

export function formatDate(date: Date) {
    return new Date(date).toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}

export function formatTime(date: Date) {
    return new Date(date).toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}

export function formatOrderTime(date: Date | string) {
    if (!date) return "-";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "-";
    
    const formatter = new Intl.DateTimeFormat("id-ID", {
        timeZone: "Asia/Jakarta",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23"
    });
    
    const parts = formatter.formatToParts(d);
    let day = "", month = "", year = "", hour = "", minute = "", second = "";
    for (const part of parts) {
        if (part.type === "day") day = part.value;
        else if (part.type === "month") month = part.value;
        else if (part.type === "year") year = part.value;
        else if (part.type === "hour") hour = part.value;
        else if (part.type === "minute") minute = part.value;
        else if (part.type === "second") second = part.value;
    }
    
    return `${day}-${month}-${year} ${hour}:${minute}:${second}`;
}