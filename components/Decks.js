import React, { useState } from 'react';
import { StyleSheet, Text, Button, View } from 'react-native';
import Deck from '../components/Deck';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Decks = ({ navigation }) => {
	return (
		<Button
			title="Go to Jane's profile"
			onPress={() => navigation.navigate('Profile', { name: 'Jane' })}
		/>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default Decks;
