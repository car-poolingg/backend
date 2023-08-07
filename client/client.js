const publicVapidKey =
    "BMmxp0ySU0JPd6jEG3LV6wA1sJwZul1hUBDhRkBV4kf9fNH0IPA6E1O89chSW-0Jf-kCvszlYD8zdF8r6yac920";

// Check for service worker
if ("serviceWorker" in navigator) {
    send().catch((err) => console.error(err));
}

let token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGM4ODlhYmU1ZmY4YjdhN2NjNDgwMWUiLCJlbWFpbCI6ImdiZW1pbGVrZW9ndW5kaXBlMDdAZ21haWwuY29tIiwicm9sZSI6InBhc3NlbmdlciIsImlhdCI6MTY5MTE1NTQ5MSwiZXhwIjoxNjkzNzQ3NDkxfQ.dXzM2EfaU79ht0afTdXFY-6zlUFK5bKp17FpU9Z5X0w";
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
    await fetch("/api/v1/subscribe", {
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
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
