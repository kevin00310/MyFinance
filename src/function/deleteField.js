import { db } from "../firebase";
import { doc, deleteDoc, writeBatch } from "firebase/firestore";

// Function to delete selected transactions from Firestore
export const deleteField = async (uid, selectedTransactionIds) => {
  try {
    // Use a batch to delete multiple documents efficiently
    const batch = writeBatch(db);
    
    // Add each selected transaction to the batch for deletion
    selectedTransactionIds.forEach((transactionId) => {
      const transactionRef = doc(db, `users/${uid}/transactions`, transactionId);
      batch.delete(transactionRef);
    });

    // Commit the batch
    await batch.commit();
    console.log("Selected transactions deleted successfully:", selectedTransactionIds);
    window.location.reload();
  } catch (error) {
    console.error("Error deleting transactions:", error.message, error.code, error);
    throw error; // Re-throw the error to be caught by the caller
  }
};