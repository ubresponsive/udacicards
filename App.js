import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useReducer, useCallback } from 'react';
import 'react-native-gesture-handler';
import {
	SafeAreaView,
	StyleSheet,
	View,
	TextInput,
	Alert,
	TouchableOpacity,
	ScrollView,
	ActivityIndicator,
} from 'react-native';
import {
	Header,
	Button,
	ThemeProvider,
	Card,
	Text,
	Icon,
} from 'react-native-elements';
import {
	NavigationContainer,
	useIsFocused,
	CommonActions,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import styled, { css } from 'styled-components/native';
import Deck from './components/Deck';
import Quiz from './components/Quiz';
import Question from './components/Question';
import NewQuestion from './components/NewQuestion';
import NewDeck from './components/NewDeck';
import { storeDecks, getDecks } from './utils/helpers';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { fetchUpdateAsync } from 'expo-updates';

// import Decks from './components/Decks';
// import Deck from './components/Deck';
// import NewDeck from './components/NewDeck';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Views Required
// 1. Deck List - Default View
// 2. Individual Deck View - title, number of cards, option to start quiz, option to add question
// 3. Quiz View - card question, option to view answer (flip), correct button, incorrect  button, number of cards left, percentage correct
// 4. New Deck view - enter in title for the new deck, submit new deck title
// 5. New Question View - option to enter in question, enter in answer, submit new question

export default function App({ route, navigation }) {
	return (
		<SafeAreaProvider>
			<ThemeProvider theme={theme}>
				<Header
					centerComponent={{
						text: 'UdaciCards',
						style: {
							color: '#fff',
							fontSize: '1em',
							fontWeight: '700',
							fontFamily: 'Avenir-Book',
						},
					}}
					containerStyle={{
						backgroundColor: 'rgb(68, 51, 255)',
						justifyContent: 'space-around',
						fontFamily: 'Avenir-Book',
						fontWeight: '500',
						fontSize: '16px',
					}}
				/>
				<NavigationContainer>
					<Stack.Navigator style={{ backgroundColor: 'red' }}>
						<Stack.Screen
							name="Decks"
							component={Decks}
							options={{
								title: 'Decks',
								headerTintColor: '#aaa',
								headerTitleStyle: {
									fontWeight: '500',
								},
							}}
						/>
						<Stack.Screen
							name="Deck"
							component={Deck}
							options={({ route }) => ({
								title: route.params.title,
								headerTintColor: '#aaa',
								headerTitleStyle: {
									fontWeight: '500',
								},
							})}
						/>
						<Stack.Screen
							name="Quiz"
							component={Quiz}
							options={({ route }) => ({
								title: route.params.title,
								headerTintColor: '#aaa',
								headerTitleStyle: {
									fontWeight: '500',
								},
							})}
						/>
						<Stack.Screen
							name="Question"
							component={Question}
							options={({ route }) => ({
								title: route.params.title,
							})}
						/>
						<Stack.Screen
							name="NewQuestion"
							component={NewQuestion}
							options={({ route }) => ({
								title: route.params.title,
								headerTintColor: '#aaa',
								headerTitleStyle: {
									fontWeight: '500',
								},
							})}
						/>
					</Stack.Navigator>
				</NavigationContainer>
			</ThemeProvider>
		</SafeAreaProvider>
	);
}

function Decks({ route, navigation }) {
	return (
		<Tab.Navigator
			tabBarOptions={{
				activeTintColor: '#e91e63',
				inactiveTintColor: 'gray',
			}}
		>
			<Tab.Screen
				name="Decks"
				component={CurrentDecks}
				options={{
					tabBarLabel: 'Decks',
					tabBarIcon: ({ color, size }) => (
						<Icon name="home" color="rgb(68, 51, 255)" />
					),
				}}
			/>
			<Tab.Screen
				name="Add Deck"
				component={NewDeck}
				options={{
					tabBarLabel: 'Add Deck',
					tabBarIcon: ({ color, size }) => <Icon name="add" color="green" />,
				}}
			/>
		</Tab.Navigator>
	);
}

function CurrentDecks({ route, navigation }) {
	const isFocused = useIsFocused();
	const [isReady, setIsReady] = useState(false);
	const [decks, setDecks] = useState({});

	async function fetchData() {
		const loadStorage = await storeDecks();
		const data = await getDecks();
		setDecks(data);
		setIsReady(true);
	}

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			fetchData();
		});

		return unsubscribe;
	}, [navigation]);

	const onButtonClick = () => {
		setIsReady(false);
		storeDecks(true);
		setTimeout(function () {
			fetchData();
		}, 1000);
	};

	if (!isReady) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					flexDirection: 'row',
					padding: 10,
				}}
			>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	console.log('--app-render');

	const arrDb = Object.entries(decks);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ScrollView>
				<View style={{ flex: 1, padding: 20, flexDirection: 'column' }}>
					<View>
						<Text
							h1
							h1Style={{
								color: 'rgb(68, 51, 255)',
								fontWeight: 500,
								fontFamily: 'Avenir-Heavy',
								textAlign: 'center',
								fontSize: '1.75em',
								padding: '20px',
							}}
						>
							Decks
						</Text>
						{!arrDb.length && (
							<View>
								<Text
									h2
									h2Style={{
										color: '#e91e63',
										fontWeight: 500,
										fontSize: '1em',
										fontFamily: 'Avenir-Heavy',
										textAlign: 'center',
										padding: '20px',
									}}
								>
									There are no decks to view
								</Text>
								<View style={styles.buttonsContainer}>
									<Button
										title="Load Sample Deck"
										onPress={onButtonClick}
										containerStyle={{
											marginVertical: 10,
										}}
									/>
								</View>
							</View>
						)}
						{arrDb.map((deck, index) => (
							<Card key={deck[0]} style={{ flex: 1 }}>
								<Card.Title
									style={{
										fontSize: '1.2em',
										color: '#000',
										fontWeight: '500',
										width: '100%',
										textAlign: 'center',
										fontFamily: 'Avenir-Heavy',
									}}
								>
									{deck[1].title}
								</Card.Title>
								<Card.Divider />
								<View>
									<Text
										style={{
											fontSize: '1.0em',
											color: '#000',
											fontWeight: '500',
											paddingBottom: '10px',
											width: '100%',
											textAlign: 'center',
											fontFamily: 'Avenir-Medium',
										}}
									>
										{deck[1].questions.length} cards
									</Text>
								</View>
								<View>
									<View style={styles.buttonsContainer}>
										<Button
											onPress={() => {
												navigation.navigate('Deck', {
													title: deck[0],
													deckId: deck[0],
													otherParam: deck[1],
												});
											}}
											title="Go to Deck"
										/>
									</View>
								</View>
							</Card>
						))}
						{/*
				<Text>Title of Each Deck</Text>
				<Text>Number of Cards in Deck</Text>
				 <Button
					title="Go to Home"
					onPress={() => navigation.navigate('Home')}
				/>
				<Button title="Go back" onPress={() => navigation.goBack()} /> */}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const theme = {
	Text: {
		fontFamily: 'Avenir-Regular',
	},
	h1Style: {
		color: 'red',
		fontSize: '20px',
		fontFamily: 'Avenir-Book',
		textAlign: 'center',
	},
	h2: {
		color: 'red',
		fontSize: '20px',
		fontFamily: 'Avenir-Book',
		textAlign: 'center',
	},
	Button: {
		raised: true,
		titleStyle: {
			color: 'white',
			fontSize: '1em',
		},
		buttonStyle: {
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: '#e60067',
			padding: '20px 30px',
			height: '40px',
			padding: '10px',
			borderRadius: '3px',
			minWidth: '10em',
		},
		containerStyle: {
			textAlign: 'center',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
		},
	},
};

const styles = StyleSheet.create({
	contentView: {
		flex: 1,
	},
	buttonsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		marginVertical: 20,
	},
});
