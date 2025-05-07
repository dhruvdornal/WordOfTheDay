import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_OUT_DURATION = 250;

const WordCard = forwardRef(({ word, onSwipeLeft, onSwipeRight }, ref) => {
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
    outputRange: ['-20deg', '0deg', '20deg'],
    extrapolate: 'clamp'
  });

  // for fade-in icons during swipe
  const newWordOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH * 0.25],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const previousWordOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH * 0.25, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  // swipe methods to parent component
  useImperativeHandle(ref, () => ({
    swipeLeft: () => forceSwipe('left'),
    swipeRight: () => forceSwipe('right')
  }));

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gesture) => {
        position.setValue({ x: gesture.dx, y: 0 }); // restricting to horizontal movement
      },
      onPanResponderRelease: (evt, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      }
    })
  ).current;

  const forceSwipe = (direction) => {
    const x = direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
    
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction) => {
    if (direction === 'right' && typeof onSwipeRight === 'function') {
      onSwipeRight();
    } else if (direction === 'left' && typeof onSwipeLeft === 'function') {
      onSwipeLeft();
    }
    
    // Reset position after animation
    position.setValue({ x: 0, y: 0 });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 4,
      useNativeDriver: false
    }).start();
  };

  const getCardStyle = () => {
    return {
      transform: [
        { translateX: position.x },
        { rotate }
      ]
    };
  };

  return (
    <Animated.View
      style={[styles.card, getCardStyle()]}
      {...panResponder.panHandlers}
    >
      {/* "New Word" icon overlay */}
      <Animated.View style={[styles.swipeIconContainer, styles.newWordContainer, { opacity: newWordOpacity }]}>
        <MaterialIcons name="arrow-forward" size={40} color="#6a5acd" />
        <Text style={[styles.swipeText, { color: '#6a5acd' }]}>NEW WORD</Text>
      </Animated.View>
      
      {/* "Previous Word" icon overlay */}
      <Animated.View style={[styles.swipeIconContainer, styles.previousWordContainer, { opacity: previousWordOpacity }]}>
        <MaterialIcons name="arrow-back" size={40} color="#6a5acd" />
        <Text style={[styles.swipeText, { color: '#6a5acd' }]}>PREVIOUS</Text>
      </Animated.View>
      
      <View style={styles.header}>
        <MaterialIcons name="translate" size={24} color="#6a5acd" />
        <Text style={styles.word}>{word?.word || 'Word of the Day'}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>Definition</Text>
        <Text style={styles.definition}>
          {word?.definition || 'Loading definition...'}
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>Example</Text>
        <Text style={styles.example}>
          {word?.example || 'Example usage will appear here'}
        </Text>
      </View>
      
      <View style={styles.footer}>
        <MaterialIcons name="calendar-today" size={14} color="#6c757d" />
        <Text style={styles.date}>
          {word?.date ? new Date(word.date).toLocaleDateString() : 'Today'}
        </Text>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    width: SCREEN_WIDTH - 50,
    height: '80%',
    maxHeight: 500,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingBottom: 15,
  },
  word: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#343a40',
    marginLeft: 10,
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6a5acd',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  definition: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 24,
  },
  example: {
    fontSize: 15,
    color: '#6c757d',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  date: {
    fontSize: 12,
    color: '#6c757d',
    marginLeft: 5,
  },
  swipeIconContainer: {
    position: 'absolute',
    top: '40%',
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderWidth: 2,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  newWordContainer: {
    right: 30,
    borderColor: '#6a5acd',
    transform: [{ rotate: '20deg' }],
  },
  previousWordContainer: {
    left: 30,
    borderColor: '#6a5acd',
    transform: [{ rotate: '-20deg' }],
  },
  swipeText: {
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 5,
  },
});

// Ensure component name is set for debugging purposes
WordCard.displayName = 'WordCard';

export default WordCard;

