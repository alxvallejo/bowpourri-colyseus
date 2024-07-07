import { useEffect } from 'react';
import { useAuth, supabase } from '../../context/AuthProvider';
import { useForm, Controller } from 'react-hook-form';
import { Form, Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckboxInput, TextInput } from '../../common/form';

const defaultTriviaForm = {
    question: '',
    option_1: '',
    option_2: '',
    option_3: '',
    option_4: '',
    answer: '',
};

export default function NewQuestion() {
    const { user } = useAuth();
    const { register, handleSubmit, control, reset } = useForm({
        defaultValues: defaultTriviaForm,
    });
    const { state } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (state) {
            reset({ ...state });
        }
    }, [state]);

    const onSubmit = async (data: any) => {
        if (state) {
            console.log('state: ', state);
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
        navigate('/trivia');
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <TextInput
                label='Question'
                name='question'
                control={control}
                required
            />

            <table className='table'>
                <thead>
                    <tr>
                        <th>Question</th>
                        <th>Is Answer</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className=''>
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
                    <tr>
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
                    <tr>
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
                    <tr>
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
            <div className='form-group'>
                <button type='submit' className='btn btn-primary'>
                    Save
                </button>
                <Link to='..' className='btn btn-secondary'>
                    Cancel
                </Link>
            </div>
        </Form>
    );
}
