import { createClient, Session, User } from '@supabase/supabase-js';
import { createContext, useState, useEffect, useContext } from 'react';

export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

const AuthContext = createContext({
    user: null,
});

export const useAuth = () => {
    return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                console.log('session onAuthStateChange: ', session);
                setSession(session);
                setUser(session?.user || null);
                setLoading(false);
            }
        );
        return () => {
            listener?.subscription.unsubscribe();
        };
    }, []);

    // In case we want to manually trigger a signIn (instead of using Auth UI)
    const signIn = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { skipBrowserRedirect: false },
        });
        console.log('data: ', data);
        console.log('error: ', error);
        return { data, error };
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        console.log('error: ', error);
        if (!error) {
            setUser(null);
            setSession(null);
        }
        return { error };
    };

    return (
        <AuthContext.Provider value={{ user, signIn, signOut }}>
            {!loading ? children : `<div>Loading...</div>`}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
