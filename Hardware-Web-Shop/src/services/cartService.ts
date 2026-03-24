import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db, auth, OperationType, handleFirestoreError } from '../firebase';

export async function addToCart(productId: string, quantity: number = 1) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Bitte melde dich an, um Produkte in den Warenkorb zu legen.');
  }

  try {
    const cartRef = collection(db, `users/${user.uid}/cart`);
    const q = query(cartRef, where('product_id', '==', productId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Update existing item
      const itemDoc = querySnapshot.docs[0];
      const currentQty = itemDoc.data().quantity;
      await updateDoc(doc(db, `users/${user.uid}/cart`, itemDoc.id), {
        quantity: currentQty + quantity
      });
    } else {
      // Add new item
      await addDoc(cartRef, {
        product_id: productId,
        quantity: quantity
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/cart`);
  }
}
