import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

export const addTransaction = async (transaction) => {
  try {
    const docRef = await addDoc(
      collection(db, `users/${transaction.uid}/transactions`),
      transaction
    );
    console.log("Document written with ID: ", docRef.id);
      // alert("Transaction Added!");
      // console.log("Transaction Added!");
      window.location.reload();
  } catch (e) {
    console.error("Error adding document: ", e);
      // alert("Couldn't add transaction");
      // console.log("Couldn't add transaction");
  }
}
