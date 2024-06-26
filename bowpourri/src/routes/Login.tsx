import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthProvider';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../context/AuthProvider';

export default function Login() {
    const { signIn } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = ({ email, password }) => {
        const { data, error } = signIn(email, password);
        console.log('error: ', error);
        console.log('data: ', data);
    };

    return (
        <div
            className='hero min-h-screen bg-base-200'
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className='hero-content flex-col lg:flex-row-reverse'>
                <div className='text-center lg:text-left'>
                    <h1 className='text-5xl font-bold'>Bowpourri</h1>
                    <p className='py-6'>
                        Provident cupiditate voluptatem et in. Quaerat fugiat ut
                        assumenda excepturi exercitationem quasi. In deleniti
                        eaque aut repudiandae et a id nisi.
                    </p>
                </div>
                <div className='card shrink-0 w-full max-w-sm shadow-2xl bg-base-100'>
                    <form className='card-body'>
                        <Auth
                            supabaseClient={supabase}
                            appearance={{ theme: ThemeSupa }}
                            providers={['google']}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}
