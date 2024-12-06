import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useUserContext } from "./UserContext";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { userdata, setUserdata } = useUserContext();  // add setUserdata to update context
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.clear();
    }, []);

    const validate = () => {
        if (!username.trim() || !password.trim()) {
            toast.warning('Please enter both username and password');
            return false;
        }
        return true;
    };

    const handleGoogleLoginSuccess = (response) => {
        try {
            const decoded = jwtDecode(response.credential);
            const googleUser = {
                id: decoded.name || 'GoogleUser', // Unique id for Google user
                name: decoded.name || 'GoogleUser',
                email: decoded.email,
                role: 'user', // Default role for Google login
                password: 'no password', // No password for Google login, or you can create a random password
                phone: 'no phone',
                address: 'no address',
                country: 'no country'
            };

            // Foydalanuvchi ma'lumotlari mavjudmi tekshirish
            const existingUser = userdata.user.find(u => u.id === googleUser.id);

            if (!existingUser) {
                // Agar foydalanuvchi mavjud bo'lmasa, uni userdata ga qo'shish
                setUserdata({
                    ...userdata,
                    user: [...userdata.user, googleUser]
                });
            }

            // Google login muvaffaqiyatli bo'lsa, sessionStorage ga saqlash
            sessionStorage.setItem('username', googleUser.id);
            sessionStorage.setItem('jwtToken', response.credential);
            toast.success('Google login successful');
            navigate('/');
        } catch (error) {
            toast.error('Google login decoding failed: ' + error.message);
        }
    };

    const handleGoogleLoginError = () => {
        toast.error('Google login failed');
    };

    const ProceedLogin = (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        const user = userdata.user.find((u) => u.id === username);

        if (user) {
            if (user.password === password) {
                toast.success('Login successful');
                sessionStorage.setItem('username', username);
                sessionStorage.setItem('userrole', user.role);
                navigate('/');
            } else {
                toast.error('Invalid password');
            }
        } else {
            toast.error('User not found');
        }
        setLoading(false);
    };

    return (
        <GoogleOAuthProvider clientId="1080989563562-jkbhgns016lt2036fo06incnc1oi9v4t.apps.googleusercontent.com">
            <div className="row">
                <div className="offset-lg-3 col-lg-6" style={{ marginTop: '100px' }}>
                    <form onSubmit={ProceedLogin} className="container">
                        <div className="card">
                            <div className="card-header">
                                <h2>User Login</h2>
                            </div>
                            <div className="card-body">
                                <div className="form-group">
                                    <label>Username</label>
                                    <input
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="form-control"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="form-control"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <div className="card-footer">
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Logging in...' : 'Login'}
                                </button>
                                <Link to="/register" className="btn btn-success">New User</Link>

                                <div style={{ marginTop: '10px' }}>
                                    <GoogleLogin
                                        onSuccess={handleGoogleLoginSuccess}
                                        onError={handleGoogleLoginError}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default Login;
