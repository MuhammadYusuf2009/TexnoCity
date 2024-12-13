import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useUserContext } from "./UserContext";
import './components/login.css'
import rasm from './components/img/photo_2024-11-25_09-41-16-removebg-preview.png'
const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showpass, setShowpass] = useState(false)
    const { userdata, setUserdata } = useUserContext();

    const showPasswrod = () => {
        setShowpass(!showpass);
    };
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
                id: decoded.name || 'GoogleUser',
                name: decoded.name || 'GoogleUser',
                email: decoded.email,
                role: 'user',
                password: 'no password',
                phone: 'no phone',
                address: 'no address',
                country: 'no country'
            };

            const existingUser = userdata.user.find(u => u.id === googleUser.id);

            if (!existingUser) {

                setUserdata({
                    ...userdata,
                    user: [...userdata.user, googleUser]
                });
            }


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
            <form onSubmit={ProceedLogin} className="container">
                <div className="border">
                    <div className="logo">
                        <img src={rasm} width={300} height={300} alt="" />
                    </div>
                    <div class="login">
                        <form method="post" className="password-container ">
                            <input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input__login"
                                disabled={loading}
                                placeholder="Username"
                            />

                            <input
                                type={showpass ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input__login"
                                disabled={loading}
                                placeholder="Password"
                            />
                            {password && (
                                <span
                                    onClick={showPasswrod}
                                    className="password-icon"
                                >
                                    {showpass ? (
                                        <i className="fa-solid fa-eye"></i>
                                    ) : (
                                        <i className="fa-solid fa-eye-slash"></i>
                                    )}
                                </span>
                            )}
                            <h6>Forgot Password</h6>
                        </form>
                        <div className="login__fotter">
                            <button type="submit" className="buttton" disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                            <li>
                                <Link to="/register" className="user__click">
                                    New User
                                </Link>
                            </li>
                        </div>

                        <div className="google__link">
                            <GoogleLogin
                                onSuccess={handleGoogleLoginSuccess}
                                onError={handleGoogleLoginError}
                            />
                        </div>
                        <div className="link__tarmoq">
                            <h4>telegram</h4>
                            <h4>instagram</h4>
                            <h4>face
                                
                            </h4>
                        </div>
                    </div>
                </div>
            </form>
        </GoogleOAuthProvider >
    );
};

export default Login;
