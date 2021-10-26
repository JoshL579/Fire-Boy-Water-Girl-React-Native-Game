import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GameRoot } from './Screens/GameRoot';

export default function App() {
  return (
    // <View>
    <>
      <GameRoot />
      <StatusBar style="hidden" />
    </>
    // </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
