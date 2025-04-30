import { db } from "../firebase";
import { doc, deleteDoc, writeBatch } from "firebase/firestore";

// func to delete selected transactions
export const deleteField = async (uid, selectedTransactionIds) => {
  try {
    // use batch to delete multiple documents efficiently
    const batch = writeBatch(db);
    
    // add each selected transaction to the batch for deletion
    selectedTransactionIds.forEach((transactionId) => {
      const transactionRef = doc(db, `users/${uid}/transactions`, transactionId);
      batch.delete(transactionRef);
    });

    // commit the batch
    await batch.commit();
    console.log("Selected transactions deleted successfully:", selectedTransactionIds);
    window.location.reload();
  } catch (error) {
    console.error("Error deleting transactions:", error.message, error.code, error);
    throw error; 
  }
};