import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getWordHistory, clearWordHistory } from '../storage/storage';
import { Searchbar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

// kept simple card component as the swiping wasn't feeling good
const SimpleWordCard = ({ word }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialIcons name="translate" size={20} color="#6a5acd" />
        <Text style={styles.wordText}>{word.word}</Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.cardSection}>
        <Text style={styles.sectionLabel}>Definition</Text>
        <Text style={styles.definitionText}>{word.definition || 'No definition available'}</Text>
      </View>
      
      {word.example && (
        <View style={styles.cardSection}>
          <Text style={styles.sectionLabel}>Example</Text>
          <Text style={styles.exampleText}>{word.example}</Text>
        </View>
      )}
    </View>
  );
};

const HistoryScreen = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [isClearing, setIsClearing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getWordHistory();
      setHistory(data);
      setFilteredHistory(data);
      console.log("History loaded:", data.length, "items");
    } catch (error) {
      console.error('Error loading history:', error);
      Alert.alert('Error', 'Failed to load history.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load history when component mounts
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Also reload when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadHistory();
      return () => {};
    }, [loadHistory])
  );

  // Filter history when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredHistory(history);
    } else {
      const filtered = history.filter(item => 
        item.word?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.definition && item.definition.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredHistory(filtered);
    }
  }, [searchQuery, history]);
  
  // Function that does the clearing
  const clearHistory = () => {
    Alert.alert(
      'Confirm',
      'Clear all history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Yes, Clear',
          onPress: async () => {
            try {
              console.log("Clearing history...");
              setIsClearing(true);
              
              // Clear the history
              await clearWordHistory();
              console.log("History cleared!");
              
              // Updating the UI
              setHistory([]);
              setFilteredHistory([]);
              setSearchQuery('');
              
              // Success alert
              Alert.alert('Success', 'History has been cleared.');
            } catch (e) {
              console.error('Error clearing history:', e);
              Alert.alert('Error', 'Failed to clear history.');
            } finally {
              setIsClearing(false);
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.wordItem}>
      <SimpleWordCard word={item} />
      <Text style={styles.dateText}>
        Viewed on: {new Date(item.date).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Word History</Text>
        <TouchableOpacity 
          style={[styles.clearButton, (isClearing || history.length === 0) && styles.disabledButton]}
          onPress={clearHistory}
          disabled={isClearing || history.length === 0}
        >
          <MaterialIcons name="delete" size={20} color="#fff" />
          <Text style={styles.clearButtonText}>
            {isClearing ? "Clearing..." : "Clear"}
          </Text>
        </TouchableOpacity>
      </View>
      
      <Searchbar
        placeholder="Search words or definitions..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        inputStyle={styles.searchInput}
        iconColor="#6a5acd"
        placeholderTextColor="#888"
        clearIcon="close-circle"
        onClear={() => setSearchQuery('')}
      />
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6a5acd" />
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      ) : filteredHistory.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="history" size={50} color="#6a5acd" opacity={0.5} />
          <Text style={styles.emptyText}>
            {searchQuery.trim() === '' 
              ? 'No history found.' 
              : 'No matching words found.'}
          </Text>
          {searchQuery.trim() !== '' && 
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearSearchText}>Clear search</Text>
            </TouchableOpacity>
          }
        </View>
      ) : (
        <FlatList
          data={filteredHistory}
          keyExtractor={(item, index) => `${item.word || 'unknown'}-${index}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#343a40',
    flex: 1,
  },
  clearButton: {
    backgroundColor: '#6a5acd',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  searchBar: {
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderColor: '#e9ecef',
    borderWidth: 1,
  },
  searchInput: {
    fontSize: 16,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 20,
  },
  wordItem: {
    marginBottom: 15,
  },
  dateText: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 4,
    textAlign: 'right',
    fontStyle: 'italic',
    paddingRight: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#6c757d',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6c757d',
    marginTop: 15,
  },
  clearSearchText: {
    color: '#6a5acd',
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  
  // SimpleWordCard styles
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#6a5acd',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  wordText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 10,
  },
  cardSection: {
    marginTop: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6a5acd',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  definitionText: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
  },
  exampleText: {
    fontSize: 14,
    color: '#6c757d',
    fontStyle: 'italic',
    lineHeight: 20,
  },
});

export default HistoryScreen;