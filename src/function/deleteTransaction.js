import { db } from "../firebase";
import { collection, query, orderBy, limit, getDocs, writeBatch } from "firebase/firestore";

// Function to delete all documents in a collection or subcollection
export async function deleteTransaction(collectionPath, batchSize = 50) {
  try {
    console.log(`Starting deletion of collection: ${collectionPath}`);
    const collectionRef = collection(db, collectionPath);
    const q = query(collectionRef, orderBy('__name__'), limit(batchSize));
    return await deleteQueryBatch(q);
  } catch (error) {
    console.error("Error in deleteCollection:", error.message, error.code, error);
    throw error;
  }
}

async function deleteQueryBatch(q) {
  try {
    const snapshot = await getDocs(q);

    const batchSize = snapshot.size;
    if (batchSize === 0) {
      console.log("No more documents to delete. Deletion complete.");
      return;
    }

    console.log(`Deleting batch of ${batchSize} documents...`);
    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    console.log("Batch deletion successful.");
    

    // Add a small delay to avoid overwhelming Firestore
    await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms delay
    await deleteQueryBatch(q); // Continue deleting the next batch
  } catch (error) {
    console.error("Error in deleteQueryBatch:", error.message, error.code, error);
    throw error;
  }
}