import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
// Import these from their correct paths
import { getRandomWord } from '../utils/WordService';
import { saveWordToHistory } from '../storage/storage';
import WordCard from '../components/WordCard';

const SCREEN_WIDTH = Dimensions.get('window').width;

const HomeScreen = () => {
  const [currentWord, setCurrentWord] = useState(null);
  const [wordHistory, setWordHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const wordCardRef = useRef(null);

  const fetchNewWord = useCallback(async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      const word = await getRandomWord();
      const wordWithDate = {
        ...word,
        date: new Date().toISOString()
      };
      await saveWordToHistory(wordWithDate);
      
      // Add to history and set as current word
      setWordHistory(prev => [...prev, wordWithDate]);
      setCurrentWord(wordWithDate);
      setCurrentIndex(prev => prev + 1);
    } catch (err) {
      console.error('Error fetching word:', err);
      Alert.alert('Error', 'Failed to fetch a new word. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [loading]); // loading as dependency

  // Initial fetch on component mount
  useEffect(() => {
    if (wordHistory.length === 0) {
      fetchNewWord();
    }
  }, [fetchNewWord, wordHistory.length]); 

  // Reload when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // If there's no current word, fetch one
      if (!currentWord && !loading) {
        fetchNewWord();
      }
      return () => {};
    }, [currentWord, loading, fetchNewWord]) 
  );

  const handleSwipeLeft = () => {
    if (currentIndex > 1) {
      const previousIndex = currentIndex - 2;
      setCurrentWord(wordHistory[previousIndex]);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSwipeRight = () => {
    fetchNewWord();
  };

  // this is for button press
  const handleNewWordButton = () => {
    if (wordCardRef.current) {
      wordCardRef.current.swipeRight();
    } else {
      fetchNewWord();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Word of the Day</Text>
      
      <Text style={styles.swipeHint}>
        <MaterialIcons name="swap-horiz" size={16} color="#6a5acd" /> 
        Swipe left for previous, right for new
      </Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6a5acd" />
          <Text style={styles.loadingText}>Discovering your next word...</Text>
        </View>
      ) : currentWord ? (
        <View style={styles.cardContainer}>
          <WordCard 
            word={currentWord} 
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            ref={wordCardRef}
          />
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="error-outline" size={50} color="#6a5acd" />
          <Text style={styles.emptyText}>No word available</Text>
          <Text style={styles.emptySubtext}>Tap below to get started</Text>
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleNewWordButton}
          disabled={loading}
        >
          <MaterialIcons name="auto-awesome" size={24} color="white" />
          <Text style={styles.buttonText}>
            {loading ? 'Loading...' : 'New Word'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.secondaryButton, styles.historyButton]}
          onPress={() => navigation.navigate('History')}
        >
          <MaterialIcons name="history" size={24} color="#6a5acd" />
          <Text style={styles.secondaryButtonText}>View History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    paddingTop: 60,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#343a40',
    fontFamily: 'sans-serif-medium',
  },
  swipeHint: {
    textAlign: 'center',
    color: '#6a5acd',
    marginBottom: 20,
    fontSize: 14,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    color: '#6c757d',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#343a40',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6a5acd',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginTop: 15,
  },
  historyButton: {
    borderWidth: 1,
    borderColor: '#6a5acd',
  },
  secondaryButtonText: {
    color: '#6a5acd',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default HomeScreen;

