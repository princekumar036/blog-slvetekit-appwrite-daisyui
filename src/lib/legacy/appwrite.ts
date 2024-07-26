
import { error } from '@sveltejs/kit';
import { Client, Account, Databases, Query, ID } from 'appwrite';
import { writable } from 'svelte/store';

const client = new Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6692d4680017cb6f025a');

const account = new Account(client);
const databases = new Databases(client);

// USER STORE AND AUTH
function userStore() {
    const { subscribe, set } = writable();

    (async () => {
        try {
            const response = await account.get();
            set(response)
        } catch (error) {
            set(null)
        }
    })()

    const login = async (email:string, password:string) => {
        try {
            const res = await account.createEmailPasswordSession(email, password);
            set(res);
            return res
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    const logout = async () => {
        try {
            await account.deleteSession('current');
            set(null);
            return
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    }

    return {
        subscribe,
        login,
        logout
    };
}

export const user = userStore()


// COLLECTION STORE
export function collectionStore(ref:string) {
    const collId = IDs[ref]
    if (!collId) return 

    const { subscribe, set, update } = writable();

    (async () => {
        try {
            const response = await databases.listDocuments(IDs.db, collId)
            set(response.documents)
        } catch (error) {
            set(null)
        }
    })()

    return {
        subscribe,
    };
}

// DOCUMENT STORE
export function docStore(ref:string) {
    const [ collectionName, docId ] = ref.split('/')
    const collId = IDs[collectionName]
    if (!collId || !docId) return 

    const { subscribe, set, update } = writable();

    (async () => {
        try {
            const response = await databases.getDocument(IDs.db, collId, docId)
            set(response)
        } catch (error) {
            set(null)
        }
    })()

    return {
        subscribe,
    }
}