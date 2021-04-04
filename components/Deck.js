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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, CommonActions } from '@react-navigation/native';

function Deck({ route, navigation }) {
	const isFocused = useIsFocused();
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

	console.log('--deck-render');

	return (
		<View style={{ flex: 1, padding: 20, flexDirection: 'column' }}>
			<Card style={{ flex: 1 }}>
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
					{title}
				</Card.Title>
				<Card.Divider />
				<View>
					<Text
						h2
						h2Style={{
							color: 'rgb(68, 51, 255)',
							fontWeight: 500,
							fontSize: '20px',
							fontFamily: 'Avenir-Heavy',
							textAlign: 'center',
							fontSize: '1.75em',
							padding: '20px',
						}}
					>
						{deck[1].questions.length} cards
					</Text>
				</View>
				<View>
					{isError && (
						<Error>
							Sorry, you cannot take a quiz because there are no cards in the
							deck
						</Error>
					)}
				</View>
				<View>
					<View style={styles.buttonsContainer}>
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
							containerStyle={{
								marginVertical: 10,
							}}
						/>
						<Button
							onPress={() => startQuiz()}
							title="Start Quiz"
							bgColor="#160B8E"
							buttonStyle={{
								backgroundColor: 'rgb(68, 51, 255)',
								borderRadius: 3,
							}}
							containerStyle={{
								marginVertical: 10,
							}}
						/>
						<Button
							onPress={() => onDelete()}
							type="clear"
							titleStyle={{
								color: '#000',
								fontSize: '1em',
							}}
							buttonStyle={{
								backgroundColor: 'transparent',
							}}
							containerStyle={{
								marginVertical: 10,
							}}
							title="delete deck"
						></Button>
					</View>
				</View>
			</Card>
		</View>
	);
}

export default Deck;

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
	Button: {
		raised: true,
		titleStyle: {
			color: 'white',
			fontSize: '1em',
		},
		buttonStyle: {
			flex: 1,
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: '#e60067',
			padding: '20px 30px',
			height: '40px',
			padding: '10px',
			borderRadius: '3px',
			minWidth: '10em',
			marginVertical: 20,
		},
		containerStyle: {
			textAlign: 'center',
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			marginVertical: 20,
		},
	},
};

const Error = styled.Text`
	font-size: 1em;
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
	border: 1px solid rgba(235, 67, 25, 0.925);
	background: rgba(230, 182, 182, 0.925);
	padding: 15px;
	color: rgba(214, 16, 16, 0.925);
`;

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
