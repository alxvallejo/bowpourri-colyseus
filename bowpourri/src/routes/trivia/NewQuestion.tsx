import { useEffect, useState } from 'react';
import { useAuth, supabase } from '../../context/AuthProvider';
import { useForm, Controller } from 'react-hook-form';
import { Form, Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckboxInput, TextAreaInput, TextInput } from '../../common/form';

const defaultTriviaForm = {
    question: '',
    topic: '',
    option_1: '',
    option_2: '',
    option_3: '',
    option_4: '',
    answer: '',
    description: '',
    image_url: '',
};

export default function NewQuestion() {
    const { user } = useAuth();
    const { register, handleSubmit, control, reset } = useForm({
        defaultValues: defaultTriviaForm,
    });
    const { state } = useLocation();
    const navigate = useNavigate();
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState('');

    const getTopics = async () => {
        const { data, error } = await supabase.from('topics').select('name');
        setTopics(data);
    };

    useEffect(() => {
        if (state) {
            reset({ ...state });
            setSelectedTopic(state.topic);
        } else {
            reset(defaultTriviaForm);
        }
    }, [state]);

    useEffect(() => {
        getTopics();
    }, []);

    const onSubmit = async (data: any) => {
        console.log('submitting', data);
        data.topic = selectedTopic;
        if (state) {
            const { data: trivia, error } = await supabase
                .from('trivia_questions')
                .update([
                    {
                        ...data,
                        email: user?.email,
                    },
                ])
                .eq('id', state.id);
        } else {
            const { data: trivia, error } = await supabase
                .from('trivia_questions')
                .insert([
                    {
                        ...data,
                        email: user?.email,
                    },
                ]);
        }
        navigate('/questions');
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <TextAreaInput
                label='Question'
                name='question'
                control={control}
                required
            />

            {topics.map((topic, i) => {
                const selected = selectedTopic === topic.name;
                const className = selected
                    ? `btn btn-secondary`
                    : `btn btn-outline btn-secondary`;
                return (
                    <button
                        key={topic.name}
                        type='button'
                        className={`${className} ml-3`}
                        onClick={() => setSelectedTopic(topic.name)}
                    >
                        {topic.name}
                    </button>
                );
            })}

            <table className='table'>
                <thead>
                    <tr>
                        <th>Option</th>
                        <th>Is Answer</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='border-none'>
                        <td>
                            <TextInput
                                label='Option 1'
                                name='option_1'
                                control={control}
                                required
                            />
                        </td>
                        <td>
                            <input
                                type='radio'
                                value='option_1'
                                {...register('answer')}
                                className='radio radio-accent'
                            />
                        </td>
                    </tr>
                    <tr className='border-none'>
                        <td>
                            <TextInput
                                label='Option 2'
                                name='option_2'
                                control={control}
                                required
                            />
                        </td>
                        <td>
                            <input
                                type='radio'
                                value='option_2'
                                {...register('answer')}
                                className='radio radio-accent'
                            />
                        </td>
                    </tr>
                    <tr className='border-none'>
                        <td>
                            <TextInput
                                label='Option 3'
                                name='option_3'
                                control={control}
                                required
                            />
                        </td>
                        <td>
                            <input
                                type='radio'
                                value='option_3'
                                {...register('answer')}
                                className='radio radio-accent'
                            />
                        </td>
                    </tr>
                    <tr className='border-none'>
                        <td>
                            <TextInput
                                label='Option 4'
                                name='option_4'
                                control={control}
                                required
                            />
                        </td>
                        <td>
                            <input
                                type='radio'
                                value='option_4'
                                {...register('answer')}
                                className='radio radio-accent'
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            <TextAreaInput
                label='Provide some context for your answer.'
                name='description'
                control={control}
                required
            />
            <TextInput label='Image URL' name='image_url' control={control} />
            <div className='form-group mt-4'>
                <button
                    type='submit'
                    className='btn btn-outline btn-primary'
                    disabled={!selectedTopic}
                >
                    Save
                </button>
                <Link to='..' className='btn btn-outline btn-neutral ml-4'>
                    Cancel
                </Link>
            </div>
        </Form>
    );
}
