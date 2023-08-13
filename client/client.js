const publicVapidKey = "BMmxp0ySU0JPd6jEG3LV6wA1sJwZul1hUBDhRkBV4kf9fNH0IPA6E1O89chSW-0Jf-kCvszlYD8zdF8r6yac920";

// Check for service worker
if ("serviceWorker" in navigator) {
    send().catch((err) => console.error(err));
}

let token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkcml2ZXJJZCI6IjY0ZDkwZmMxNzNjZDAzNTQyZDNlZTY4YSIsImVtYWlsIjoiZ2JlbWlsZWtlb2d1bmRpcGUwN0BnbWFpbC5jb20iLCJyb2xlIjoiZHJpdmVyIiwiaWF0IjoxNjkxOTQ2OTgwLCJleHAiOjE2OTQ1Mzg5ODB9.O7ro0OGfsHLdq8jQQxqDaE7RsC_Om9s24sa2MC1TuXY";
// Register SW, Register Push, Send Push
async function send() {
    // Register Service Worker
    console.log("Registering service worker...");
    const register = await navigator.serviceWorker.register("/worker.js", {
        scope: "/api/v1",
    });
    console.log("Service Worker Registered...");

    // Register Push
    console.log("Registering Push...");
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });
    console.log("Push Registered...");

    // Send Push Notification
    console.log("Sending Push...");
    await fetch("/api/v1/driver-subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "application/json",
        },
    });
    console.log("Push Sent...");
}

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
