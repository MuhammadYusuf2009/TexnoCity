import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useUserContext } from "./UserContext";
import './components/login.css'
const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showpass, setShowpass] = useState(false)
    const { userdata, setUserdata } = useUserContext();
    const [isForgotModalOpen, setIsForgotModalOpen] = useState(false); // Modal holati
    const [resetEmail, setResetEmail] = useState(''); //

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
            <div className="login__header">
                <form onSubmit={ProceedLogin} className="container">
                    <div className="login__card">
                        <div className="login__imgcard"></div>
                        <div className="login__form__card">

                            <div className="login__form">
                                <div className="text">
                                    <h3>Welcome back <br></br>
                                    </h3>
                                    <h4>Welcome back! Please enter your details.</h4>
                                </div>
                                <div className="login__group" style={{ marginTop: '40px' }}>
                                    <input
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="input__login"
                                        disabled={loading}
                                        placeholder="Username"
                                    />
                                </div>
                                <div className="login__group loginst">
                                    <div className="input__container" style={{ position: 'relative' }}>
                                        <input
                                            type={showpass ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="input__login"
                                            disabled={loading}
                                            placeholder="Password"
                                        />
                                        {password && (
                                            <li
                                                onClick={showPasswrod}
                                                style={{
                                                    listStyle: 'none',
                                                    position: 'absolute',
                                                    top: '10px',
                                                    marginLeft: '280px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {showpass ? (
                                                    <i className="fa-solid fa-eye"></i>
                                                ) : (
                                                    <i className="fa-solid fa-eye-slash"></i>
                                                )}
                                            </li>
                                        )}
                                        <h5 className="forgot">Forgot password</h5>
                                    </div>
                                </div>

                            </div>
                            <div className="login__fotter">
                                <button type="submit" className="buttton" disabled={loading}>
                                    {loading ? 'Logging in...' : 'Login'}
                                </button>
                                <li><Link to="/register" className="user__click">New User</Link></li>
                            </div>
                            <div style={{ marginTop: '30px', marginLeft: '80px', width: '320px' }}>
                                <GoogleLogin
                                    onSuccess={handleGoogleLoginSuccess}
                                    onError={handleGoogleLoginError}
                                />
                                <div className="loginbut">
                                    <h4><svg xmlns="http://www.w3.org/2000/svg" width="50" height="30" viewBox="0 0 102 102" id="instagram">
                                        <defs>
                                            <radialGradient id="a" cx="6.601" cy="99.766" r="129.502" gradientUnits="userSpaceOnUse">
                                                <stop offset=".09" stop-color="#fa8f21"></stop>
                                                <stop offset=".78" stop-color="#d82d7e"></stop>
                                            </radialGradient>
                                            <radialGradient id="b" cx="70.652" cy="96.49" r="113.963" gradientUnits="userSpaceOnUse">
                                                <stop offset=".64" stop-color="#8c3aaa" stop-opacity="0"></stop>
                                                <stop offset="1" stop-color="#8c3aaa"></stop>
                                            </radialGradient>
                                        </defs>
                                        <path fill="url(#a)" d="M25.865,101.639A34.341,34.341,0,0,1,14.312,99.5a19.329,19.329,0,0,1-7.154-4.653A19.181,19.181,0,0,1,2.5,87.694,34.341,34.341,0,0,1,.364,76.142C.061,69.584,0,67.617,0,51s.067-18.577.361-25.14A34.534,34.534,0,0,1,2.5,14.312,19.4,19.4,0,0,1,7.154,7.154,19.206,19.206,0,0,1,14.309,2.5,34.341,34.341,0,0,1,25.862.361C32.422.061,34.392,0,51,0s18.577.067,25.14.361A34.534,34.534,0,0,1,87.691,2.5a19.254,19.254,0,0,1,7.154,4.653A19.267,19.267,0,0,1,99.5,14.309a34.341,34.341,0,0,1,2.14,11.553c.3,6.563.361,8.528.361,25.14s-.061,18.577-.361,25.14A34.5,34.5,0,0,1,99.5,87.694,20.6,20.6,0,0,1,87.691,99.5a34.342,34.342,0,0,1-11.553,2.14c-6.557.3-8.528.361-25.14.361s-18.577-.058-25.134-.361"></path>
                                        <path fill="url(#b)" d="M25.865,101.639A34.341,34.341,0,0,1,14.312,99.5a19.329,19.329,0,0,1-7.154-4.653A19.181,19.181,0,0,1,2.5,87.694,34.341,34.341,0,0,1,.364,76.142C.061,69.584,0,67.617,0,51s.067-18.577.361-25.14A34.534,34.534,0,0,1,2.5,14.312,19.4,19.4,0,0,1,7.154,7.154,19.206,19.206,0,0,1,14.309,2.5,34.341,34.341,0,0,1,25.862.361C32.422.061,34.392,0,51,0s18.577.067,25.14.361A34.534,34.534,0,0,1,87.691,2.5a19.254,19.254,0,0,1,7.154,4.653A19.267,19.267,0,0,1,99.5,14.309a34.341,34.341,0,0,1,2.14,11.553c.3,6.563.361,8.528.361,25.14s-.061,18.577-.361,25.14A34.5,34.5,0,0,1,99.5,87.694,20.6,20.6,0,0,1,87.691,99.5a34.342,34.342,0,0,1-11.553,2.14c-6.557.3-8.528.361-25.14.361s-18.577-.058-25.134-.361"></path>
                                        <path fill="#fff" d="M461.114,477.413a12.631,12.631,0,1,1,12.629,12.632,12.631,12.631,0,0,1-12.629-12.632m-6.829,0a19.458,19.458,0,1,0,19.458-19.458,19.457,19.457,0,0,0-19.458,19.458m35.139-20.229a4.547,4.547,0,1,0,4.549-4.545h0a4.549,4.549,0,0,0-4.547,4.545m-30.99,51.074a20.943,20.943,0,0,1-7.037-1.3,12.547,12.547,0,0,1-7.193-7.19,20.923,20.923,0,0,1-1.3-7.037c-.184-3.994-.22-5.194-.22-15.313s.04-11.316.22-15.314a21.082,21.082,0,0,1,1.3-7.037,12.54,12.54,0,0,1,7.193-7.193,20.924,20.924,0,0,1,7.037-1.3c3.994-.184,5.194-.22,15.309-.22s11.316.039,15.314.221a21.082,21.082,0,0,1,7.037,1.3,12.541,12.541,0,0,1,7.193,7.193,20.926,20.926,0,0,1,1.3,7.037c.184,4,.22,5.194.22,15.314s-.037,11.316-.22,15.314a21.023,21.023,0,0,1-1.3,7.037,12.547,12.547,0,0,1-7.193,7.19,20.925,20.925,0,0,1-7.037,1.3c-3.994.184-5.194.22-15.314.22s-11.316-.037-15.309-.22m-.314-68.509a27.786,27.786,0,0,0-9.2,1.76,19.373,19.373,0,0,0-11.083,11.083,27.794,27.794,0,0,0-1.76,9.2c-.187,4.04-.229,5.332-.229,15.623s.043,11.582.229,15.623a27.793,27.793,0,0,0,1.76,9.2,19.374,19.374,0,0,0,11.083,11.083,27.813,27.813,0,0,0,9.2,1.76c4.042.184,5.332.229,15.623.229s11.582-.043,15.623-.229a27.8,27.8,0,0,0,9.2-1.76,19.374,19.374,0,0,0,11.083-11.083,27.716,27.716,0,0,0,1.76-9.2c.184-4.043.226-5.332.226-15.623s-.043-11.582-.226-15.623a27.786,27.786,0,0,0-1.76-9.2,19.379,19.379,0,0,0-11.08-11.083,27.748,27.748,0,0,0-9.2-1.76c-4.041-.185-5.332-.229-15.621-.229s-11.583.043-15.626.229" transform="translate(-422.637 -426.196)"></path>
                                    </svg></h4>
                                    <h4><a href=""><svg xmlns="http://www.w3.org/2000/svg" width="50" height="30" fill="none" viewBox="0 0 48 48" id="telegram">
                                        <rect width="48" height="48" fill="#419FD9" rx="24"></rect>
                                        <rect width="48" height="48" fill="url(#paint0_linear)" rx="24"></rect>
                                        <path fill="#fff" d="M10.7874 23.4709C17.7667 20.3663 22.4206 18.3195 24.7493 17.3305C31.3979 14.507 32.7795 14.0165 33.68 14.0002C33.878 13.9968 34.3208 14.0469 34.6077 14.2845C34.8499 14.4852 34.9165 14.7563 34.9484 14.9465C34.9803 15.1368 35.02 15.5702 34.9884 15.9088C34.6281 19.774 33.0692 29.1539 32.276 33.483C31.9404 35.3148 31.2796 35.929 30.6399 35.9891C29.2496 36.1197 28.1938 35.051 26.8473 34.1497C24.7401 32.7395 23.5498 31.8615 21.5044 30.4854C19.1407 28.895 20.673 28.0209 22.0201 26.5923C22.3726 26.2185 28.4983 20.5295 28.6169 20.0135C28.6317 19.9489 28.6455 19.7083 28.5055 19.5813C28.3655 19.4543 28.1589 19.4977 28.0098 19.5322C27.7985 19.5812 24.4323 21.8529 17.9113 26.3473C16.9558 27.0172 16.0904 27.3435 15.315 27.3264C14.4602 27.3076 12.8159 26.833 11.5935 26.4273C10.0942 25.9296 8.90254 25.6666 9.0063 24.8215C9.06035 24.3813 9.65403 23.9311 10.7874 23.4709Z"></path>
                                        <defs>
                                            <linearGradient id="paint0_linear" x1="24" x2="24" y2="47.644" gradientUnits="userSpaceOnUse">
                                                <stop stop-color="#2AABEE"></stop>
                                                <stop offset="1" stop-color="#229ED9"></stop>
                                            </linearGradient>
                                        </defs>
                                    </svg></a></h4>
                                    <h4><a href="" > <svg xmlns="http://www.w3.org/2000/svg" width="50" height="30" viewBox="0 0 1024 1024" id="facebook">
                                        <path fill="#1877f2" d="M1024,512C1024,229.23016,794.76978,0,512,0S0,229.23016,0,512c0,255.554,187.231,467.37012,432,505.77777V660H302V512H432V399.2C432,270.87982,508.43854,200,625.38922,200,681.40765,200,740,210,740,210V336H675.43713C611.83508,336,592,375.46667,592,415.95728V512H734L711.3,660H592v357.77777C836.769,979.37012,1024,767.554,1024,512Z"></path>
                                        <path fill="#fff" d="M711.3,660,734,512H592V415.95728C592,375.46667,611.83508,336,675.43713,336H740V210s-58.59235-10-114.61078-10C508.43854,200,432,270.87982,432,399.2V512H302V660H432v357.77777a517.39619,517.39619,0,0,0,160,0V660Z"></path>
                                    </svg></a></h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </GoogleOAuthProvider >
    );
};

export default Login;
