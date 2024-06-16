import React, { useContext, useEffect, useState } from 'react';
import { userLogin } from '~/services/auth';

export const AuthContext = React.createContext({
    user: null,
    signIn: (_username: string, _password: string) => {},
    signOut: () => {},
    expiry: null,
});

export const useAuth = () => {
    return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [expiry, setExpiry] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        const storedExpiry = localStorage.getItem('expiry');
        if (storedExpiry) {
            console.log('storedExpiry: ', storedExpiry);
            setExpiry(storedExpiry);
        }
        setLoading(false);
    }, []);

    const signIn = async (username: string, password: string) => {
        const resp = await userLogin(username, password);
        if (!resp.user) {
            // addToast('Incorrect Credentials', { appearance: 'error' });
            console.log('error');
        } else {
            setUser(resp.user);
            localStorage.setItem('user', JSON.stringify(resp.user));
            localStorage.setItem('token', resp.token);
            localStorage.setItem('expiry', resp.expiry);
            setExpiry(resp.expiry);
        }
    };

    const signOut = async () => {
        localStorage.clear();
        setUser(null);
    };

    // if (expiry && new Date(expiry) < new Date()) {
    //   console.log('should redirect to login');
    //   localStorage.clear();
    //   return redirect('/login');
    // }

    if (loading) {
        return <div>Loading...</div>;
    }

    console.log('render authcontext children');

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, expiry }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
