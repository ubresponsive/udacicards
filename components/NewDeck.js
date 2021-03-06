import React, { useState } from 'react';
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
import { useForm, Controller } from 'react-hook-form';
import { saveDeckTitle } from '../utils/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';

function NewDeck({ route, navigation }) {
	// 4. New Deck view - enter in title for the new deck, submit new deck title
	const { control, handleSubmit } = useForm();
	const [deckTitle, setDeckTitle] = useState('');
	const [isSuccess, setIsSuccess] = useState(false);
	const [isError, setIsError] = useState(false);
	const [isBlank, setIsBlank] = useState(false);

	const addTitle = async () => {
		const res = await saveDeckTitle(deckTitle);
		res === 'success'
			? (setIsError(false), setDeckTitle(''), navigation.navigate('Decks'))
			: (setIsError(true), setIsSuccess(false));
	};

	const onSubmit = () => {
		setIsSuccess(false);
		if (!deckTitle) {
			setIsBlank(true);
			return;
		}
		if (!isError || !isBlank) {
			try {
				addTitle();
			} catch (e) {
				console.log(e);
			}
		}
	};

	function handleChange(value) {
		setDeckTitle(value);
		setIsSuccess(false);
		setIsError(false);
		value ? setIsBlank(false) : setIsBlank(true);
	}

	return (
		<ScrollView>
			<View style={{ flex: 1, padding: 20 }}>
				<Card>
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
						Add a new deck
					</Card.Title>
					<Card.Divider />
					<H2>What is the title of your new deck?</H2>
					{isSuccess && <Success>Deck added</Success>}
					{isError && <Error>Deck title already used</Error>}
					{isBlank && <Error>A Deck Title is required.</Error>}
					<Controller
						control={control}
						render={({ onChange, onBlur, value }) => (
							<>
								<Input
									placeholder="Deck Title Here"
									placeholderTextColor="#ccc"
									onBlur={onBlur}
									name="decktitle"
									onChangeText={(value) => handleChange(value)}
									value={deckTitle}
								/>
							</>
						)}
						name="deckTitle"
						defaultValue=""
					/>
					<View style={theme.buttonsContainer}>
						<Button
							onPress={handleSubmit(onSubmit)}
							title="Add Deck"
							containerStyle={{
								marginVertical: 10,
							}}
						/>
					</View>
				</Card>
			</View>
		</ScrollView>
	);
}

export default NewDeck;

const theme = {
	Text: {
		fontFamily: 'Avenir-Regular',
	},
	h1Style: {
		color: 'red',
		fontSize: 18,
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

/* other styles */
const H2 = styled.Text`
	font-size: 20px;
	color: rgb(230, 0, 103);
	font-weight: 500;
	padding-bottom: 10px;
	margin: 0 auto;
	text-align: center;
	font-family: 'Avenir-Medium';
`;

const Input = styled.TextInput`
	border: 1px solid #e3e3e3;
	width: 80%;
	margin: 20px auto 20px;
	height: 50px;
	padding: 10px;
	border-radius: 2px;
`;

const Success = styled.Text`
	font-size: 16px;
	text-align: center;
	font-family: 'Avenir-Book';
	border-radius: 5px;
	text-align: center;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	align-content: center;
	width: 80%;
	margin: 10px auto 10px;
	border-width: 1px;
	border-color: rgb(2, 141, 2);
	background: rgb(171, 207, 171);
	padding: 15px;
	color: rgb(2, 141, 2);
`;

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
	background: rgba(230, 182, 182, 0.925);
	padding: 15px;
	color: rgba(214, 16, 16, 0.925);
`;
