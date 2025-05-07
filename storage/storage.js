import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = 'WORD_HISTORY';

export const saveWordToHistory = async (wordObj) => {
  try {
    // Validate the word object
    if (!wordObj || !wordObj.word) {
      console.error('Invalid word object:', wordObj);
      return false;
    }

    // Get existing history
    const existing = await AsyncStorage.getItem(HISTORY_KEY);
    let history = [];
    
    try {
      history = existing ? JSON.parse(existing) : [];
    } catch (parseError) {
      console.error('Error parsing history:', parseError);
      history = []; // Reset if corrupted
    }

    // Check if this word already exists in history
    const alreadyExists = history.some(item => item.word === wordObj.word);
    
    if (!alreadyExists) {
      // Add the new word at the beginning of the array
      const updatedHistory = [wordObj, ...history];
      
      // Save the updated history
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
      console.log('Word saved to history:', wordObj.word);
      return true;
    }
    return false;
  } catch (e) {
    console.error('Error saving word to history:', e);
    throw e; // Re-throw to allow proper error handling
  }
};

export const getWordHistory = async () => {
  try {
    console.log('Getting word history...');
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    
    if (!data) {
      console.log('No history found in storage');
      return [];
    }
    
    try {
      const parsedData = JSON.parse(data);
      console.log(`Found ${parsedData.length} words in history`);
      return parsedData;
    } catch (parseError) {
      console.error('Error parsing history data:', parseError);
      return [];
    }
  } catch (e) {
    console.error('Error getting word history:', e);
    throw e; // Re-throw to allow proper error handling
  }
};

export const clearWordHistory = async () => {
  try {
    console.log('Clearing word history...');
    
    // First check if there's anything to clear
    const existingData = await AsyncStorage.getItem(HISTORY_KEY);
    if (!existingData) {
      console.log('No history to clear');
      return true;
    }
    
    // Actually clear the data
    await AsyncStorage.removeItem(HISTORY_KEY);
    console.log('Word history cleared successfully');
    
    // verify it's gone
    const checkAfter = await AsyncStorage.getItem(HISTORY_KEY);
    if (checkAfter === null) {
      console.log('Verified: history is cleared');
      return true;
    } else {
      console.error('Failed to clear history');
      return false;
    }
  } catch (e) {
    console.error('Error clearing word history:', e);
    throw e; // Re-throw to allow proper error handling
  }
};  