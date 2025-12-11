import Pusher from 'pusher-js';

const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY;
const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

if (!PUSHER_KEY || !PUSHER_CLUSTER) {
    console.warn("Pusher Public Keys are missing in environment variables.");
}

let pusherInstance: any = null;
export const getPusherClient = (userId?:string) => {
    if (pusherInstance) {
        return pusherInstance;
    }

    if (!PUSHER_KEY) {
        console.error("Pusher key is missing. Cannot initialize client.");
        return undefined;
    }
    pusherInstance = new Pusher(PUSHER_KEY, {
        cluster: PUSHER_CLUSTER!,
        authEndpoint: "/api/pusher/auth",
        auth: {
            params:{userId}
        }
    });

    return pusherInstance;
};



