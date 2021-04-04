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
import AsyncStorage from '@react-native-async-storage/async-storage';

function Question({ route, navigation }) {
	// push index and hide button, activate silent onclick if another question exists
	console.log('route.params', route.params);
	const { questions, qId } = route.params;
	const count = questions.length;
	const [showQ, setShowQ] = useState(true);
	const [results, setResults] = useState(0);

	const toggleQA = (type) => {
		if (type === 'a') {
			setShowQ(false);
		} else {
			setShowQ(true);
		}
	};

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
					{qId + 1}/{count} - results {results}/{count}
				</Card.Title>
				<Card.Divider />
				{showQ && (
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
							{questions[qId].question}
						</Text>
						<Text>
							<View style={styles.buttonsContainer}>
								<Button
									onPress={() => toggleQA('a')}
									type="clear"
									titleStyle={{
										color: 'rgb(68, 51, 255)',
										fontFamily: 'Avenir-Medium',
										fontSize: '1em',
									}}
									buttonStyle={{
										backgroundColor: 'transparent',
									}}
									containerStyle={{
										marginVertical: 5,
									}}
									title="Show Answer"
								></Button>
							</View>
						</Text>
					</View>
				)}
				{!showQ && (
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
							{questions[qId].answer}
						</Text>
						<Text>
							<View style={styles.buttonsContainer}>
								<Button
									onPress={() => toggleQA('q')}
									type="clear"
									titleStyle={{
										color: 'rgb(68, 51, 255)',
										fontFamily: 'Avenir-Medium',
										fontSize: '1em',
									}}
									buttonStyle={{
										backgroundColor: 'transparent',
									}}
									containerStyle={{
										marginVertical: 5,
									}}
									title="Show Question"
								></Button>
							</View>
						</Text>
					</View>
				)}
				<View>
					<View style={styles.buttonsContainer}>
						<Button
							onPress={() => {
								setResults(results !== count ? results + 1 : count);
								setShowQ(true);
								if (qId !== count) {
									navigation.navigate('Question', {
										questions,
										qId: qId !== count ? qId + 1 : count,
									});
								}
							}}
							title="Correct"
							buttonStyle={{
								backgroundColor: 'green',
								borderRadius: 3,
							}}
							containerStyle={{
								marginVertical: 10,
							}}
						/>
						<Button
							title="Incorrect"
							onPress={() => {
								if (qId !== count) {
									navigation.navigate('Question', {
										questions,
										qId: qId !== count ? qId + 1 : count,
									});
								}
							}}
							buttonStyle={{
								backgroundColor: 'red',
								borderRadius: 3,
							}}
							containerStyle={{
								marginVertical: 10,
							}}
						/>

						<Button
							onPress={() => {
								setShowQ(true);
								navigation.navigate('Question', {
									questions,
									qId: 1,
								});
							}}
							containerStyle={{
								marginVertical: 20,
							}}
							title="Next Question"
						/>
					</View>
				</View>
			</Card>
		</View>
	);
}

export default Question;
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
