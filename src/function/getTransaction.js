import { db } from "../firebase";
import { query, getDocs, collection } from "firebase/firestore";

export const getTransaction = async (uid) => {
  try {
    const q = query(collection(db, `users/${uid}/transactions`));
    const querySnapshot = await getDocs(q);
    let transactionsArray = [];
    querySnapshot.forEach((doc) => {
      // include  document ID in transaction data
      transactionsArray.push({ id: doc.id, ...doc.data() });
    });
    // console.log("Fetched Transactions:", transactionsArray);
    return transactionsArray;
  } catch (e) {
    console.error("Error getting document: ", e);
    alert("Couldn't get transaction");
    return [];
  }
};