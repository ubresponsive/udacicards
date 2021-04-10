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
	Badge,
} from 'react-native-elements';
import styled, { css } from 'styled-components/native';
import { getDeck } from '../utils/helpers';

function Question({ route, navigation }) {
	const [isReady, setIsReady] = useState(false);
	const { questions, deckId, qId } = route.params;
	const [deck, setDeck] = useState({});
	const [count, setCount] = useState(questions.length);
	const [showQ, setShowQ] = useState(true);
	const [isDone, setIsDone] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [results, setResults] = useState(0);

	const toggleQA = (type) => {
		if (type === 'a') {
			setShowQ(false);
		} else {
			setShowQ(true);
		}
	};

	async function fetchData() {
		const data = await getDeck(deckId);
		setDeck(data);
		setCount(data[1].questions.length);
		setIsReady(true);
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
			<View
				style={{
					flex: 1,
					padding: 20,
				}}
			>
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
						Card {qId + 1}/{count}
					</Card.Title>
					<Badge
						value={`${results}`}
						status="success"
						containerStyle={{ position: 'absolute', top: -4, right: -4 }}
					/>
					<Card.Divider />
					<View>
						{isSuccess && (
							<View>
								<Success>Quiz Complete</Success>
								<Text
									style={{
										flex: 1,
										flexDirection: 'column',
										justifyContent: 'center',
										fontFamily: 'Avenir-Book',
										textAlign: 'center',
										fontWeight: 'bold',
										alignItems: 'center',
										color: 'green',
										fontSize: 14,
										marginVertical: 5,
									}}
								>
									Score: {results}/{count}
								</Text>
								<View style={theme.buttonsContainer}>
									<Button
										onPress={() => navigation.navigate('Decks')}
										type="clear"
										titleStyle={{
											color: '#000',
											fontFamily: 'Avenir-Medium',
											fontSize: 14,
										}}
										buttonStyle={{
											backgroundColor: 'transparent',
										}}
										containerStyle={{
											marginVertical: 0,
										}}
										title="Home"
										icon={
											<Icon
												name="home"
												color="black"
												containerStyle={{
													fontSize: 30,
													marginRight: 5,
												}}
											/>
										}
									></Button>
								</View>
							</View>
						)}

						{!isDone && (
							<View>
								{showQ && (
									<View>
										<View>
											<Text
												h2
												h2Style={{
													color: '#e91e63',
													fontWeight: '500',
													fontSize: 14,
													fontFamily: 'Avenir-Heavy',
													textAlign: 'center',
													paddingTop: 10,
												}}
											>
												{deck[1].questions[qId].question}
											</Text>
										</View>
										<View style={theme.buttonsContainer}>
											<Button
												onPress={() => toggleQA('a')}
												type="clear"
												titleStyle={{
													color: 'rgb(68, 51, 255)',
													fontSize: 14,
													minHeight: 40,
													fontFamily: 'Avenir-Medium',
												}}
												buttonStyle={{
													backgroundColor: 'transparent',
												}}
												containerStyle={{
													marginTop: 5,
												}}
												title="Show Answer"
											/>
										</View>
									</View>
								)}
								{!showQ && (
									<View>
										<Text
											h2
											h2Style={{
												color: '#e91e63',
												fontWeight: '500',
												fontSize: 14,
												fontFamily: 'Avenir-Heavy',
												textAlign: 'center',
												paddingTop: 10,
											}}
										>
											{deck[1].questions[qId].answer}
										</Text>

										<View style={{ display: 'block', width: '100%' }}>
											<Button
												onPress={() => toggleQA('q')}
												type="clear"
												titleStyle={{
													color: 'rgb(68, 51, 255)',
													fontFamily: 'Avenir-Medium',
													fontSize: 14,
												}}
												buttonStyle={{
													backgroundColor: 'transparent',
												}}
												containerStyle={{
													marginVertical: 5,
													display: 'block',
													width: '100%',
												}}
												title="Show Question"
											></Button>
										</View>
									</View>
								)}
								<View style={theme.buttonsContainer}>
									<Button
										onPress={() => {
											setResults(results !== count ? results + 1 : count);
											setShowQ(true);
											if (qId !== count - 1) {
												navigation.navigate('Question', {
													questions,
													qId: qId !== count - 1 ? qId + 1 : count - 1,
												});
											} else {
												setIsSuccess(true);
												setIsDone(true);
											}
										}}
										title="Correct"
										buttonStyle={{
											backgroundColor: 'green',
										}}
									/>
								</View>
								<View style={theme.buttonsContainer}>
									<Button
										title="Incorrect"
										onPress={() => {
											if (qId !== count - 1) {
												navigation.navigate('Question', {
													questions,
													qId: qId !== count - 1 ? qId + 1 : count - 1,
												});
											} else {
												setIsSuccess(true);
												setIsDone(true);
											}
										}}
										buttonStyle={{
											backgroundColor: 'red',
										}}
									/>
								</View>
							</View>
						)}
					</View>
				</Card>
			</View>
		</ScrollView>
	);
}

export default Question;

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
		minHeight: 40,
	},
};

const Success = styled.Text`
	font-size: 16px;
	text-align: center;
	font-family: 'Avenir-Heavy';
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
