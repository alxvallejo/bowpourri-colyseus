import { createClient } from '@supabase/supabase-js';
import { Question } from '../rooms/schema/TriviaState';

// Create a single supabase client for interacting with your database
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

export const getRandomTriviaQuestion = async () => {
    const { data, error } = await supabase
        .from('trivia_questions')
        .select(
            'id, answered_on, question, topic, option_1, option_2, option_3, option_4, created_at, email, answer, description, image_url'
        )
        .is('answered_on', null);
    if (error) {
        console.log('error: ', error);
        throw error;
    }
    if (data.length === 0) {
        return null;
    }
    // Choose a random question
    const randomIndex = Math.floor(Math.random() * data.length);
    const randomQuestion = new Question(data[randomIndex]);
    console.log('randomQuestion: ', randomQuestion);
    const answerIndex = randomQuestion.answer;

    const answer = randomQuestion[`${answerIndex}`];
    console.log('answer: ', answer);
    return { randomQuestion, answer };
};

export const getAnswer = async (questionId: string) => {
    const { data, error } = await supabase
        .from('trivia')
        .select('id, answered_on, answer')
        .eq('id', questionId);
    if (error) {
        throw error;
    }
    if (data.length === 0) {
        return null;
    }
    return data[0];
};

export const getTriviaStats = async () => {
    const { data, error } = await supabase
        .from('trivia_questions')
        .select('id, total_questions, total_answered');
    if (error) {
        throw error;
    }
    if (data.length === 0) {
        return null;
    }
    return data[0];
};
