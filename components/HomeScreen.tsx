import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Types';
import { readFileAsync } from '../utils/FileUtil';

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [menu, setMenu] = useState<{ breakfast?: string; lunch?: string; dinner?: string }>({});
  const [isMenuVisible, setIsMenuVisible] = useState(false); // State for menu visibility

  const navigateToInput = (fileName: string) => {
    navigation.navigate('RegisterMeal', { fileName });
  };

  const getRandomEntry = async (fileName: string) => {
    const entries = await readFileAsync(fileName); // Use the utility function
    if (entries.length === 0) {
      return 'No Meal Registered';
    }
    return entries[Math.floor(Math.random() * entries.length)];
  };

  const generateMenu = async () => {
    const breakfast = await getRandomEntry('breakfast');
    const lunch = await getRandomEntry('lunch');
    const dinner = await getRandomEntry('dinner');

    setMenu({ breakfast, lunch, dinner });
    setIsMenuVisible(true); // Show the menu after generating it
  };

  const renderButton = (title: string, onPress: () => void, isSurprise = false) => (
    <TouchableOpacity style={[styles.button, isSurprise ? styles.surpriseButton : styles.mealButton]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://www.shutterstock.com/image-photo/businessman-lifting-lid-tray-600nw-197073413.jpg' }}
        style={styles.backgroundImage}
      />
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Hey Love!{'\n'}Ready for some good food</Text>
      </View>
      <View style={styles.buttonContainer}>
        {renderButton("Breakfast", () => navigateToInput('breakfast'))}
        {renderButton("Lunch", () => navigateToInput('lunch'))}
        {renderButton("Dinner", () => navigateToInput('dinner'))}
        {renderButton("Surprise Me!", generateMenu, true)}
      </View>
      <View style={styles.menuWrapper}>
        {isMenuVisible && (
          <View style={styles.menuContainer}>
            <Text style={styles.menuHeading}>Menu for the Day:</Text>
            <Text style={styles.menuText}>Breakfast: {menu.breakfast || 'No entry found'}</Text>
            <Text style={styles.menuText}>Lunch: {menu.lunch || 'No entry found'}</Text>
            <Text style={styles.menuText}>Dinner: {menu.dinner || 'No entry found'}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 20, // Adjust top padding if needed
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headingContainer: {
    position: 'absolute',
    top: 10,
    zIndex: 1,
    alignItems: 'center',
    width: '100%',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 10,
  },
  buttonContainer: {
    padding: 10,
    alignItems: 'center',
    gap: 10,
    marginTop:250, // Add margin to create space below the buttons
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 200,
    alignItems: 'center',
  },
  mealButton: {
    backgroundColor: '#E8F0FE', // Light chic color for meals
  },
  surpriseButton: {
    backgroundColor: '#FF6F61', // Distinct color for Surprise Me
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuWrapper: {
    width: '100%', // Take full width
    alignItems: 'center', // Center the menu text
  },
  menuContainer: {
    backgroundColor: '#E0F7FA',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center', // Center the menu items
  },
  menuHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  menuText: {
    fontSize: 16,
    color: 'black',
  },
});

export default HomeScreen;
