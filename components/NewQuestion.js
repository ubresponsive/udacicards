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
import { addCardToDeck } from '../utils/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';

function NewQuestion({ route, navigation }) {
	// 4. New Question view - enter in a question and answer
	const { title, deckId, otherParam } = route.params;
	const { control, handleSubmit, errors, reset } = useForm();
	const [isSuccess, setIsSuccess] = useState(false);
	const [isError, setIsError] = useState(false);

	const onSubmit = (data) => {
		setIsSuccess(false);
		setIsError(false);

		// submit to database
		const addCard = async () => {
			const res = await addCardToDeck(deckId, JSON.stringify(data));
			res === 'success'
				? (setIsSuccess(true), setIsError(false), navigation.navigate('Deck'))
				: setIsError(true);
		};
		addCard();
	};

	return (
		<ScrollView>
			<View style={{ flex: 1, padding: 20, flexDirection: 'column' }}>
				<Card>
					<Card.Title
						style={{
							fontSize: 18,
							color: '#000',
							fontWeight: '500',
							width: '100%',
							textAlign: 'center',
							fontFamily: 'Avenir-Heavy',
						}}
					>
						Add a Card to {deckId}
					</Card.Title>
					<Card.Divider />
					<H2>Include a Question and Answer</H2>
					{isSuccess && <Success>Deck added</Success>}
					{isError && <Error>Card already used</Error>}
					{errors.question && <Error>A question is required.</Error>}
					{errors.answer && <Error>A answer is required.</Error>}
					<Controller
						control={control}
						render={({ onChange, onBlur, value }) => (
							<>
								<Input
									placeholder="enter your question here"
									placeholderTextColor="#ccc"
									onBlur={onBlur}
									name="question"
									id="question"
									type="text"
									onChangeText={(value) =>
										onChange(value, setIsSuccess(false), setIsError(false))
									}
									value={value}
								/>
							</>
						)}
						name="question"
						rules={{ required: true }}
						defaultValue=""
					/>
					<Controller
						control={control}
						render={({ onChange, onBlur, value, name }) => (
							<>
								<Input
									placeholder="enter the answer here"
									placeholderTextColor="#ccc"
									onBlur={onBlur}
									name="answer"
									id="answer"
									onChangeText={(value) =>
										onChange(value, setIsSuccess(false), setIsError(false))
									}
									value={value}
								/>
							</>
						)}
						name="answer"
						rules={{ required: true }}
						defaultValue=""
					/>
					<View style={styles.buttonsContainer}>
						<Button onPress={handleSubmit(onSubmit)} title="Add Card" />
					</View>
				</Card>
			</View>
		</ScrollView>
	);
}

export default NewQuestion;

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
		marginVertical: 20,
		backgroundColor: 'white',
	},
});

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
	border: 1px solid rgb(2, 141, 2);
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
	border: 1px solid rgba(235, 67, 25, 0.925);
	background: rgba(230, 182, 182, 0.925);
	padding: 15px;
	color: rgba(214, 16, 16, 0.925);
`;
