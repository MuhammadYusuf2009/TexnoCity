import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import './index.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.clear();
    }, []);

    const validate = () => {
        if (!username.trim()) {
            toast.warning('Please enter a username');
            return false;
        }
        if (!password.trim()) {
            toast.warning('Please enter a password');
            return false;
        }
        return true;
    };

    const handleGoogleLoginSuccess = (response) => {
        try {
            const decoded = jwtDecode(response.credential);
            sessionStorage.setItem('username', decoded.name || 'GoogleUser');
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

    const ProceedLogin = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/user/${username}`);
            const resp = await response.json();

            if (!Object.keys(resp).length) {
                toast.error('Please enter a valid username');
            } else if (resp.password === password) {
                toast.success('Login successful');
                sessionStorage.setItem('username', username);
                sessionStorage.setItem('userrole', resp.role);
                navigate('/');
            } else {
                toast.error('Invalid credentials');
            }
        } catch (error) {
            toast.error('Login failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <GoogleOAuthProvider clientId="452198251676-3t6fcj8k25ph203b59k1gdnid0ooc8c8.apps.googleusercontent.com">
            <div className="row">
                <div className="offset-lg-3 col-lg-6" style={{ marginTop: '100px' }}>
                    <form onSubmit={ProceedLogin} className="container">
                        <div className="card">
                            <div className="card-header">
                                <h2>User Login</h2>
                            </div>
                            <div className="card-body">
                                <div className="form-group">
                                    <label>Username <span className="errmsg">*</span></label>
                                    <input
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="form-control"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Password <span className="errmsg">*</span></label>
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
                                <Link className="btn btn-success" to="/register">
                                    New User
                                </Link>

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
