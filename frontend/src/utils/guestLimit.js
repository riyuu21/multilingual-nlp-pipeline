const DAILY_LIMIT = 15;
const STORAGE_KEY = 'guest_usage';

function getTodayKey() {
    return new Date().toISOString().split('T')[0];
}

export function getGuestUsage(deviceId) {
    try {
        const raw = localStorage.getItem(`${STORAGE_KEY}_${deviceId}`);
        if (!raw) return { count: 0, date: getTodayKey() };
        return JSON.parse(raw);
    } catch {
        return { count: 0, date: getTodayKey() };
    }
}

export function incrementGuestUsage(deviceId) {
    const today = getTodayKey();
    const usage = getGuestUsage(deviceId);
    const count = usage.date === today ? usage.count + 1 : 1;
    localStorage.setItem(
        `${STORAGE_KEY}_${deviceId}`,
        JSON.stringify({ count, date: today })
    );
    return count;
}

export function isGuestLimitReached(deviceId) {
    const today = getTodayKey();
    const usage = getGuestUsage(deviceId);
    if (usage.date !== today) return false;
    return usage.count >= DAILY_LIMIT;
}

export function getRemainingAnalyses(deviceId) {
    const today = getTodayKey();
    const usage = getGuestUsage(deviceId);
    if (usage.date !== today) return DAILY_LIMIT;
    return Math.max(0, DAILY_LIMIT - usage.count);
}