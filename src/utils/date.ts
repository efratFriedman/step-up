
export function toUTCDate(date: Date) {
    return new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    ));
}


export function startOfDayUTC(date: Date) {
    return new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0, 0, 0, 0
    ));
}


export function endOfDayUTC(date: Date) {
    return new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        23, 59, 59, 999
    ));
}


export function getDayIndexUTC(date: Date) {
    const utc = toUTCDate(date);
    return utc.getUTCDay();
}

export function SendingValidDate(date: string) {
    const [y, m, d] = date.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d));

}