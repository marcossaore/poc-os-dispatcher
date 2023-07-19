import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, updateDoc, deleteDoc, orderBy, onSnapshot, query, doc, addDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

export default class FirestoreAdapter {

    static selfInstance = null;

    constructor () {
        const app = initializeApp(firebaseConfig);
        this.db = getFirestore(app);
    }

    static instance () {

        if (!this.selfInstance) {
            this.selfInstance = new FirestoreAdapter()
        }

        return this.selfInstance;
    }

    addDocument (collectionName, data) {
        addDoc(collection(this.db, collectionName), data);
    }

    async updateDocument(collectionName, ref, data)  {
        const docRef = doc(this.db, collectionName, ref);
        try {
            await updateDoc(docRef, data);
            console.log("Document updated successfully!");
        } catch (error) {
            console.error("Error updating document:", error);
        }
    }

    async deleteDocument (collectionName, ref)  {
        const docRef = doc(this.db, collectionName, ref);
        await deleteDoc(docRef);
    }

    onSnap (collectionName, order, callback) {
        onSnapshot(
            query(collection(this.db, collectionName), orderBy(order)),
            (querySnapshot) => {
                querySnapshot.docChanges().forEach((change) => {
                    const data = change.doc.data();
                    callback(change.type, data, change.doc.ref.id)
                });
            }
        );
    }
}