import { db } from "../firebase";
import { query, getDocs, collection } from "firebase/firestore";

export const getTransaction = async (uid) => {
  try {
    const q = query(collection(db, `users/${uid}/transactions`));
    const querySnapshot = await getDocs(q);
    let transactionsArray = [];
    querySnapshot.forEach((doc) => {
      transactionsArray.push(doc.data());
    });
    return transactionsArray; // Return the transactions array
  } catch (e) {
    console.error("Error getting document: ", e);
    alert("Couldn't get transaction");
    return []; // Return an empty array in case of error
  }
};
