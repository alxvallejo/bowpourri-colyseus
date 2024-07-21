import { useEffect, useState } from 'react';
import { useAuth, supabase } from '../../context/AuthProvider';
import { Link, useOutletContext } from 'react-router-dom';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { PlayerData, TriviaContext } from '../../layout/DefaultLayout';
dayjs.extend(localizedFormat);

type QuestionsProps = {
    players: PlayerData[] | null;
};

export default function Questions() {
    const { user } = useAuth();
    const [questions, setQuestions] = useState([]);
    const { players } = useOutletContext<QuestionsProps>();
    const context = useOutletContext();
    console.log('context: ', context);

    const getQuestions = async () => {
        const { data, error } = await supabase
            .from('trivia_questions')
            .select()
            .eq('email', user.email)
            .order('created_at', { ascending: false });
        setQuestions(data);
    };

    useEffect(() => {
        if (user) {
            getQuestions();
        }
    }, [user]);

    return (
        <div>
            <table className='table w-full'>
                <thead>
                    <tr>
                        <th>Question</th>
                        <th>Answered On</th>
                        <th>Created At</th>
                        <th>Topic</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(questions) &&
                        questions.map((question) => (
                            <tr key={question.id} className='hover'>
                                <td>{question.question}</td>
                                <td>{question.answered_on}</td>
                                <td>
                                    {dayjs(question.created_at).format('l')}
                                </td>
                                <td>{question.topic}</td>
                                <td>
                                    <Link
                                        to={`edit/${question.id}`}
                                        state={question}
                                    >
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}
