export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [expiry, setExpiry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const signOut = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
            setExpiry(null);
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setExpiry(session?.expires_at ?? null);
            setLoading(false);
        });
    }, []);

    return (
        <AuthContext.Provider value={{ user, signOut, expiry, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};
