import { useEffect, useState } from 'react';
import { useAuth, supabase } from '../../context/AuthProvider';
import { useForm, Controller, set } from 'react-hook-form';
import { Form, Link } from 'react-router-dom';
import { CheckboxInput, TextInput } from '../../common/form';

export default function Questions() {
    const { user } = useAuth();
    const [questions, setQuestions] = useState([]);

    const getQuestions = async () => {
        const { data, error } = await supabase
            .from('trivia_questions')
            .select();
        console.log('data: ', data);
        console.log('error: ', error);

        // return { data, error };
        setQuestions(data);
    };

    useEffect(() => {
        if (user) {
            getQuestions();
        }
    }, [user]);

    return (
        <div>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Question</th>
                        <th>Answer</th>
                        <th>Answered On</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.map((question) => (
                        <tr key={question.id} className='hover'>
                            <td>{question.question}</td>
                            <td>{question.answer}</td>
                            <td>{question.created_at}</td>
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
