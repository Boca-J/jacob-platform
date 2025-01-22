import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';

import { firestore } from '@/libs/redux/store';

/**
 * Updates the favoriteToolsId field for a user in Firestore.
 * @param {string} userId - The ID of the user whose favorites need to be updated.
 * @param {string} toolId - The ID of the tool to add or remove from favorites.
 * @param {'add' | 'remove'} action - The action to perform: 'add' to add to favorites, 'remove' to remove from favorites.
 * @throws Will log errors to the console if the operation fails.
 */

const updateFavorites = async (userId, toolId, action) => {
  try {
    const userDocRef = doc(firestore, 'users', userId);

    if (action === 'add') {
      await updateDoc(userDocRef, {
        favoriteToolsId: arrayUnion(toolId),
      });
    } else if (action === 'remove') {
      await updateDoc(userDocRef, {
        favoriteToolsId: arrayRemove(toolId),
      });
    } else {
      console.warn('Invalid action provided to updateFavorites.');
    }
  } catch (err) {
    console.error('Error updating favorites:', err);
  }
};

export { updateFavorites };
