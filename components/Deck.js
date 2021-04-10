import React, { useEffect, useState } from 'react';
import {
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
import styled, { css } from 'styled-components/native';
import { getDeck, deleteDeck } from '../utils/helpers';

function Deck({ route, navigation }) {
	const [isReady, setIsReady] = useState(false);
	const [deck, setDeck] = useState({});
	const [isError, setIsError] = useState(false);
	const { title, deckId, otherParam } = route.params;

	const onDelete = async () => {
		const res = await deleteDeck(deckId);
		res === 'success' ? navigation.navigate('Decks') : '';
	};

	async function fetchData() {
		const data = await getDeck(deckId);
		setDeck(data);
		setIsReady(true);
	}

	function startQuiz() {
		if (!deck[1].questions.length) {
			setIsError(true);
			return;
		} else {
			setIsError(false);
			navigation.navigate('Question', {
				title: `Quiz`,
				deckId: deckId,
				otherParam: otherParam,
				questions: otherParam.questions,
				qId: 0,
			});
		}
	}

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			fetchData();
		});

		return unsubscribe;
	}, [navigation]);

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

	return (
		<ScrollView>
			<View style={{ flex: 1, padding: 20 }}>
				<Card style={{ flex: 1 }}>
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
						{title}
					</Card.Title>
					<Card.Divider />
					<View>
						<Text
							h2
							h2Style={{
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
					{isError && (
						<View style={{ flex: 1, padding: 10, flexDirection: 'column' }}>
							<Error>
								Sorry, you cannot take a quiz because there are no cards in the
								deck
							</Error>
						</View>
					)}
					<View style={{ flex: 1, flexDirection: 'column' }}>
						<View style={theme.buttonsContainer}>
							<Button
								title="Add Card"
								onPress={() => {
									setIsError(false);
									navigation.navigate('NewQuestion', {
										title: `Add Card to ${title}`,
										deckId: deckId,
										otherParam: otherParam,
									});
								}}
							/>
						</View>
						<View style={theme.buttonsContainer}>
							<Button
								onPress={() => startQuiz()}
								title="Start Quiz"
								buttonStyle={{
									backgroundColor: 'rgb(68, 51, 255)',
									borderRadius: 3,
								}}
							/>
						</View>
						<View style={theme.buttonsContainer}>
							<Button
								onPress={() => onDelete()}
								type="clear"
								titleStyle={{
									color: '#000',
									fontSize: 16,
								}}
								buttonStyle={{
									backgroundColor: 'transparent',
								}}
								containerStyle={{
									marginVertical: 0,
								}}
								title="delete deck"
							></Button>
						</View>
					</View>
				</Card>
			</View>
		</ScrollView>
	);
}

export default Deck;

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
	View: {
		flex: 1,
		display: 'flex',
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
};

const Error = styled.Text`
	font-size: 16px;
	text-align: center;
	font-family: 'Avenir-Book';
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	align-content: center;
	width: 80%;
	margin: 10px auto 10px;
	border-radius: 5px;
	text-align: center;
	border-width: 1px;
	border-color: rgba(235, 67, 25, 0.925);
	background-color: rgba(230, 182, 182, 0.925);
	padding: 15px;
	color: rgba(214, 16, 16, 0.925);
`;
