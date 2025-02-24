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
    //setTransactions(transactionsArray);
    alert("Transactions Fetched!");
    
  } catch (e) {
    console.error("Error getting document: ", e);
      alert("Couldn't get transaction");
      console.log("Couldn't get transaction");
  }
}
