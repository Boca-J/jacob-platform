import { doc, increment, updateDoc } from 'firebase/firestore';

import { firestore } from '@/libs/redux/store';

/**
 * Updates the tool frequency for a specific user.
 *
 * @param {string} userId - The ID of the user.
 * @param {string} toolId - The ID of the tool.
 * @returns {Promise<void>} Resolves if the update is successful, rejects with an error otherwise.
 */
const updateToolFrequency = async (userId, toolId) => {
  try {
    if (!userId || !toolId) {
      throw new Error('Both userId and toolId are required.');
    }

    const userDocRef = doc(firestore, 'users', userId);

    await updateDoc(userDocRef, {
      [`toolsFrequency.${toolId}`]: increment(1),
    });

    console.log(`Tool frequency updated for user: ${userId}, tool: ${toolId}`);
  } catch (error) {
    console.error('Error updating tool frequency:', error);
    throw error;
  }
};

export { updateToolFrequency };
