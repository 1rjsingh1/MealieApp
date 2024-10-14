import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, Text, FlatList, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/Types';
import { readFileAsync } from '../utils/FileUtil'; // Import the utility function
import * as FileSystem from 'expo-file-system';

type Props = {
  route: RouteProp<RootStackParamList, 'RegisterMeal'>; // Update to RegisterMeal
};

const RegisterMeal: React.FC<Props> = ({ route }) => {
  const { fileName } = route.params;
  const fileUri = `${FileSystem.documentDirectory}${fileName}.txt`;

  const [text, setText] = useState('');
  const [displayedText, setDisplayedText] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // Track which index is being edited

  useEffect(() => {
    loadTextFromFile();
  }, []);

  const loadTextFromFile = async () => {
    const content = await readFileAsync(fileName); // Use the utility function
    setDisplayedText(content); // Set displayed text with the loaded content
  };

  const saveTextToFile = async () => {
    try {
      // Check if the file exists
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
  
      let updatedContent: string;
  
      // Split the input text by commas and trim any whitespace
      const meals = text.split(',').map(meal => meal.trim()).filter(Boolean);
  
      if (editingIndex !== null) {
        // If editing, replace the specific entry
        const updatedList = [...displayedText];
        updatedList[editingIndex] = meals.join('\n'); // Update with new meals on separate lines
        updatedContent = updatedList.join('\n');
        setDisplayedText(updatedList);
        setEditingIndex(null); // Reset editing index
      } else {
        // If not editing, append the new meals
        if (fileInfo.exists) {
          const existingContent = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.UTF8,
          });
          updatedContent = existingContent + '\n' + meals.join('\n'); // Append new meals, each on a new line
        } else {
          // If the file doesn't exist, just use the new meals
          updatedContent = meals.join('\n'); // Store each meal on a new line
        }
      }
  
      await FileSystem.writeAsStringAsync(fileUri, updatedContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      setText(''); // Clear input
      loadTextFromFile(); // Refresh the list
      alert('Meal saved!');
    } catch (error) {
      console.error('Error saving file: ', error);
      alert('Error saving file: ' + error);
    }
  };
  
  
  const editText = (index: number) => {
    setText(displayedText[index]); // Set text to the selected item for editing
    setEditingIndex(index); // Set the index to indicate which item is being edited
  };

  const deleteText = async (index: number) => {
    const updatedList = displayedText.filter((_, i) => i !== index);
    const newContent = updatedList.join('\n');
    await FileSystem.writeAsStringAsync(fileUri, newContent);
    setDisplayedText(updatedList);
    alert('Meal removed!');
  };

  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => editText(index)}>
          <Text style={styles.button}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteText(index)}>
          <Text style={styles.button}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>
        You can add a single meal or multiple meals in a comma-separated format.
      </Text>
      <TextInput
        style={styles.textInput}
        placeholder="Enter meal(s)"
        value={text}
        onChangeText={setText}
      />
      <Button title={editingIndex !== null ? "Update" : "Save"} onPress={saveTextToFile} />
      <FlatList
        data={displayedText}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 16,
  },
  instruction: {
    marginBottom: 10,
    fontStyle: 'italic',
    color: 'gray',
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  list: {
    marginTop: 20,
    width: '100%',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    flex: 1,
    marginRight: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    marginLeft: 10,
    color: 'blue',
  },
});

export default RegisterMeal;
