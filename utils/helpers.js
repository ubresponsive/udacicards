import AsyncStorage from '@react-native-async-storage/async-storage';

const db = {
	Deck1: {
		title: 'Deck1',
		questions: [
			{
				question: 'What is React?',
				answer: 'A library for managing user interfaces',
			},
			{
				question: 'Where do you make Ajax requests in React?',
				answer: 'The componentDidMount lifecycle event',
			},
		],
	},
	Deck2: {
		title: 'Deck2',
		questions: [
			{
				question: 'What is a closure?',
				answer:
					'The combination of a function and the lexical environment within which that function was declared.',
			},
		],
	},
};

// load data in localStorage
export const storeDecks = async (reload) => {
	try {
		const decks = await AsyncStorage.getItem('decks');
		if (decks === null || reload) {
			const jsonValue = JSON.stringify(db);
			await AsyncStorage.setItem('decks', jsonValue);
			console.log('--decks loaded in localstorage');
			return;
		} else {
			console.log('--decks exists');
			return;
		}
	} catch (e) {
		// saving error
		console.log('storeDecks Error', e);
	}
};

export const getDecks = async () => {
	try {
		const jsonValue = await AsyncStorage.getItem('decks');
		console.log('--getDecks', JSON.parse(jsonValue));
		return jsonValue != null ? JSON.parse(jsonValue) : null;
	} catch (e) {
		// error reading value
		console.log('getDecks Error', e);
	}
};

export const getDeck = async (id) => {
	try {
		const jsonValue = await AsyncStorage.getItem('decks');
		const jValue = Object.entries(JSON.parse(jsonValue)).filter((deck) =>
			deck.includes(id)
		);
		console.log(`--getDeck-${id}`, jValue);
		return jValue != null ? jValue[0] : null;
	} catch (e) {
		// error reading value
		console.log('getDeck Error', e);
	}
};

export const saveDeckTitle = async (title) => {
	const jsonValue = await AsyncStorage.getItem('decks');
	const parsedJson = JSON.parse(jsonValue);
	const newTitle = { [title]: { title: title, questions: [] } };
	// check if title already exists
	const dup = Object.entries(JSON.parse(jsonValue)).filter((deck) =>
		deck[0].toLowerCase().includes(title.toLowerCase())
	);
	if (dup.length) {
		try {
			throw new Error(['Title Name already exists']);
		} catch (e) {
			console.log(e);
		} finally {
			return 'error';
		}
	}
	const decks = { ...parsedJson, ...newTitle };
	await AsyncStorage.setItem('decks', JSON.stringify(decks));
	console.log('--added-new-title', title);
	return 'success';
};

export const deleteDeck = async (title) => {
	const jsonDecks = await AsyncStorage.getItem('decks');
	const parsedDecks = JSON.parse(jsonDecks);

	const newDeck = { ...parsedDecks };
	delete newDeck[title];

	try {
		await AsyncStorage.setItem('decks', JSON.stringify(newDeck));
		console.log('--deleted-deck');
		return 'success';
	} catch (e) {
		console.log('error removing title');
		return 'error';
	}
};

export const addCardToDeck = async (title, card) => {
	const jsonDecks = await AsyncStorage.getItem('decks');
	const parsedDecks = JSON.parse(jsonDecks);
	const currentDeck = Object.entries(parsedDecks).filter(
		(deck) => deck[0] === title
	);
	const currentCards = currentDeck[0][1].questions;
	const currentCard = JSON.parse(card);

	var dup = false;
	// duplicate check
	const check = currentCards.map((ques) => {
		if (
			Object.is(ques.question, currentCard.question) &&
			Object.is(ques.answer, currentCard.answer) === true
		) {
			console.log('exists');
			dup = true;
			return;
		}
	});
	// card does not exist, add to deck
	// TODO: is it better to use mergeItem?
	if (!dup) {
		const updatedDeck = currentDeck[0][1].questions.concat(JSON.parse(card));
		const newDeck = {
			...parsedDecks,
			[title]: { title: title, questions: updatedDeck },
		};
		await AsyncStorage.setItem('decks', JSON.stringify(newDeck));
		console.log('--added-new-question');
		return 'success';
	} else {
		console.log('card already exists');
		return 'error';
	}
};
