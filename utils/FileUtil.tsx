import * as FileSystem from 'expo-file-system';

export const readFileAsync = async (fileName: string): Promise<string[]> => {
  const fileUri = `${FileSystem.documentDirectory}${fileName}.txt`;

  // Check if the file exists before trying to read it
  const fileInfo = await FileSystem.getInfoAsync(fileUri);

  if (!fileInfo.exists) {
    return []; // Return an empty array if the file doesn't exist
  }

  try {
    const content = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.UTF8 });
    return content.split('\n').filter(entry => entry.trim() !== '');
  } catch (error) {
    console.error(`Error reading ${fileName}: `, error); // Log the error for debugging
    return []; // Return an empty array on any other error
  }
};
