import FingerprintJS from '@fingerprintjs/fingerprintjs';

let cachedId = null;

export async function getDeviceId() {
    if (cachedId) return cachedId;
    
    const stored = localStorage.getItem('device_id');
    if (stored) {
        cachedId = stored;
        return cachedId;
    }

    const fp = await FingerprintJS.load();
    const result = await fp.get();
    cachedId = result.visitorId;
    localStorage.setItem('device_id', cachedId);
    return cachedId;
}