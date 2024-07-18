import { createClient } from '@supabase/supabase-js';
import { Question } from '../rooms/schema/TriviaState';

// Create a single supabase client for interacting with your database
const supabase = createClient(
    'https://gcztkgzefsiujhojbycl.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjenRrZ3plZnNpdWpob2pieWNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODIyNjQ5OTAsImV4cCI6MTk5Nzg0MDk5MH0.sJ5GQBnV2T_neMDkMA44_o2-kgkbl8FFpLk6sIaTIOI'
);

export const getRandomTriviaQuestion = async () => {
    const { data, error } = await supabase
        .from('trivia_questions')
        .select(
            'id, answered_on, question, option_1, option_2, option_3, option_4, created_at, email, answer, description, image_url'
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
