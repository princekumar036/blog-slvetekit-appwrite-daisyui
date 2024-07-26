import { Client, Account, Databases, Query, ID } from 'appwrite'
import { writable, type Writable } from 'svelte/store'
import  type { Models } from 'appwrite'

// Appwrite IDs
const dbId = '6692dc020021d4bf4436'

// Appwrite Config
const client = new Client()
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6692d4680017cb6f025a')

const account = new Account(client)
const databases = new Databases(client)

export { client, account, databases }


// Stores
export const userStore = writable<Models.User<Models.Preferences> | null>(null)
export const blogAStore = writable<Models.Document[]>([])
export const blogBStore = writable<Models.Document[]>([])

export const collMapper = [
    { name: 'Blog A', id: '6692dc0b003300685fc4', store: blogAStore },
    { name: 'Blog B', id: '669424fe001542e7c12f', store: blogBStore },
]

// USER FUNCTIONS
async function login(email:string, password:string) {
    try {
        const session = await account.createEmailPasswordSession(email, password)
        const user = await account.get()
        userStore.set(user)
        return user
    } catch (error) {
        console.error(error)
    }
}

async function authCheck() {
    try {
        const user = await account.get()
        userStore.set(user)
        return user
    } catch (error) {
        console.error(error)
    }
}

async function logout() {
    try {
        await account.deleteSession('current')
        userStore.set(null)
        return
    } catch (error) {
        console.error(error)
    }
}

export const userFunctions = { login, logout, authCheck }

// COLLECTION FUNCTIONS
async function docList(name:string) {
    const coll = collMapper.find(item => item.name === name)
    if (!coll) return

    try {
        const docList = await databases.listDocuments(dbId, coll.id)
        coll.store.set(docList.documents)
        return docList
    } catch (error) {
        console.error(error)
    }
}

async function createDoc(name:string, data) {
    const coll = collMapper.find(item => item.name === name)
    if (!coll) return

    try {
        const doc = await databases.createDocument(dbId, coll.id, 'unique()', data)
        coll.store.update(docs => [...docs, doc])
        return doc
    } catch (error) {
        console.error(error)        
    }
}

async function updateDoc(name:string, docId:string, data) {
    const coll = collMapper.find(item => item.name === name)
    if (!coll) return
    
    try {
        const updatedDoc = await databases.updateDocument(dbId, coll.id, docId, data)
        coll.store.update(docs => docs.map(doc => (doc.$id === docId ? updatedDoc : doc)))
        return updatedDoc
    } catch (error) {
        console.error(error)        
    }
}

async function deleteDoc(name:string, docId:string) {
    const coll = collMapper.find(item => item.name === name)
    if (!coll) return
    
    try {
        await databases.deleteDocument(dbId, coll.id, docId)
        coll.store.update(docs => docs.filter(doc => doc.$id !== docId))
    } catch (error) {
        console.error(error)        
    }
}

export const collectionFuctions = { docList, createDoc, updateDoc, deleteDoc }

export async function initialiseApp() {
    await authCheck()
    for (const coll of collMapper) {
        await collectionFuctions.docList(coll.name)
    }
}