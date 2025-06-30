// IndexedDB helper using idb (https://unpkg.com/idb?module)
// Usage: import { putStory, getAllStories, deleteStory } from './indexeddb-helper.js';
import { openDB } from 'https://unpkg.com/idb?module';

const DB_NAME = 'my-app-db';
const DB_VERSION = 1;
const STORE_NAME = 'stories';

async function getDb() {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        },
    });
}

export async function putStory(story) {
    const db = await getDb();
    return db.put(STORE_NAME, story);
}

export async function getAllStories() {
    const db = await getDb();
    return db.getAll(STORE_NAME);
}

export async function deleteStory(id) {
    const db = await getDb();
    return db.delete(STORE_NAME, id);
}
