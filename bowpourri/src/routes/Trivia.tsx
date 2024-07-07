import React, { useEffect } from 'react';
import { useAuth, supabase } from '../context/AuthProvider';

export default function Trivia() {
    const { user } = useAuth();

    const getProfile = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select()
            .eq('id', user?.id);
        console.log('data: ', data);
        console.log('error: ', error);

        // return { data, error };
    };

    useEffect(() => {
        if (user) {
            getProfile();
        }
    }, [user]);

    return (
        <div>
            <h1>Trivia</h1>
        </div>
    );
}
