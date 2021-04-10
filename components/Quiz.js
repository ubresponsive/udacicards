import React, { useState } from 'react';
import { StyleSheet, Button } from 'react-native';
import styled, { css } from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Quiz({ route, navigation }) {
	// 3. Quiz View - card question, option to view answer (flip), correct button, incorrect  button, number of cards left, percentage correct
	const { title, deckId, otherParam } = route.params;
	console.log(deckId);
	return (
		<Container>
			<View>
				<Text>Title = {title}</Text>
				<div>Number of Questions = {otherParam.questions.length}</div>
				<Button
					title="View Questions"
					onPress={() =>
						navigation.navigate('Question', {
							questions: otherParam.questions,
							qId: 0,
						})
					}
				/>
			</View>
		</Container>
	);
}

export default Quiz;

const Container = styled.View`
	flex: 1;
	display: flex;
	padding: 50px 0;
	justify-content: center;
	background-color: #ffffff;
	align-items: center;
	font-family: 'Avenir-Medium';
`;
const View = styled.View`
	flex: 1;
	display: flex;
	background: #fff;
	width: 100%;
	justify-content: center;
	align-items: center;
`;
const H1 = styled.Text`
	font-size: 28px;
	color: rgb(68, 51, 255);
	font-weight: 500;
	padding: 20px;
	margin: 20px 0 0;
	text-align: center;
	font-family: 'Avenir-Heavy';
`;

const H2 = styled.Text`
	font-size: 24px;
	color: rgb(230, 0, 103);
	font-weight: 500;
	padding-bottom: 10px;
	margin: 0 auto;
	text-align: center;
	font-family: 'Avenir-Medium';
`;

const H3 = styled.Text`
	font-size: 20px;
	color: #000;
	font-weight: 500;
	padding-bottom: 10px;
	margin: 0 auto;
	width: 100%;
	text-align: center;
	font-family: 'Avenir-Medium';
`;

const Tile = styled.Text`
	padding: 20px;
	margin: 0 auto;
	width: 100%;
	max-width: 800px;
	background: #dfebf6;
	font-family: 'Avenir-Medium';
	border-bottom-width: 2px;
	border-color: rgb(68, 51, 255);
`;

const Text = styled.Text`
	font-size: 16px;
	color: black;
	font-family: 'Avenir';
`;

const Input = styled.TextInput`
	border: 1px solid #000;
	width: 80%;
	margin: 20px auto 20px;
	height: 50px;
	padding: 10px;
	border-radius: 2px;
`;

const ButtonContainer = styled.TouchableOpacity`
	flex: 1;
	font-size: 16px;
	margin: 16px auto;
	height: 40px;
	padding: 0 20px;
	border-radius: 3px;
	color: #fff;
	background: #e60067;
	max-width: 10em;
	justify-content: center;
	align-items: center;
	display: flex;
	${(props) =>
		props.bgColor &&
		css`
			background: ${(props) => props.bgColor};
		`}
`;
const ButtonText = styled.Text`
	font-size: 16px;
	text-align: center;
	font-family: 'Avenir';
`;

const PressableButton = ({ onPress, bgColor, title }) => (
	<ButtonContainer onPress={onPress} bgColor={bgColor}>
		<ButtonText>{title}</ButtonText>
	</ButtonContainer>
);

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
