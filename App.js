import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
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
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import styled, { css } from 'styled-components/native';
import Deck from './components/Deck';
import Quiz from './components/Quiz';
import Question from './components/Question';
import NewQuestion from './components/NewQuestion';
import NewDeck from './components/NewDeck';
import { storeDecks, getDecks, setLocalNotification } from './utils/helpers';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { fetchUpdateAsync } from 'expo-updates';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App({ route, navigation }) {
	return (
		<SafeAreaProvider>
			<ThemeProvider theme={theme}>
				<Header
					centerComponent={{
						text: 'UdaciCards',
						style: {
							color: '#fff',
							fontSize: 16,
							fontWeight: '700',
							fontFamily: 'Avenir-Book',
						},
					}}
					containerStyle={{
						backgroundColor: 'rgb(68, 51, 255)',
						justifyContent: 'space-around',
						fontFamily: 'Avenir-Book',
						fontWeight: '500',
						fontSize: 16,
					}}
				/>
				<NavigationContainer>
					<Stack.Navigator>
						<Stack.Screen
							name="Decks"
							component={Decks}
							options={{
								title: 'Decks',
								headerTintColor: '#aaa',
								headerTitleStyle: {
									fontWeight: '500',
								},
								headerShown: false,
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
	const [isReady, setIsReady] = useState(false);
	const [decks, setDecks] = useState({});

	async function fetchData() {
		const loadStorage = await storeDecks();
		const data = await getDecks();
		setDecks(data);
		setIsReady(true);
	}

	useEffect(() => {
		setLocalNotification();
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
								fontWeight: '500',
								fontFamily: 'Avenir-Heavy',
								textAlign: 'center',
								fontSize: 22,
								padding: 10,
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
										fontWeight: '500',
										fontSize: 16,
										fontFamily: 'Avenir-Heavy',
										textAlign: 'center',
										padding: 20,
									}}
								>
									There are no decks to view
								</Text>
								<View style={theme.buttonsContainer}>
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
										fontSize: 20,
										color: '#000',
										fontWeight: '500',
										width: '100%',
										textAlign: 'center',
										fontFamily: 'Avenir-Heavy',
										marginBottom: 10,
									}}
								>
									{deck[1].title}
								</Card.Title>
								<Card.Divider />
								<View>
									<Text
										style={{
											color: 'rgb(68, 51, 255)',
											fontWeight: '500',
											fontSize: 18,
											fontFamily: 'Avenir-Heavy',
											textAlign: 'center',
											padding: 10,
										}}
									>
										{deck[1].questions.length} cards
									</Text>
								</View>
								<View>
									<View style={theme.buttonsContainer}>
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
		fontSize: 20,
		fontFamily: 'Avenir-Book',
		textAlign: 'center',
	},
	Button: {
		titleStyle: {
			color: 'white',
			fontSize: 14,
		},
		buttonStyle: {
			flex: 1,
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: '#e60067',
			minWidth: 140,
		},
	},
	buttonsContainer: {
		flex: 1,
		flexDirection: 'column',
		marginVertical: 10,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'transparent',
		minHeight: 40,
	},
};
