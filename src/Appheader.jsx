import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Appheader = () => {
    const [displayusername, displayusernameupdate] = useState('');
    const [showmenu, showmenuupdateupdate] = useState(false);
    const [userrole, setUserrole] = useState('');
    const usenavigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/login' || location.pathname === '/register') {
            showmenuupdateupdate(false);
        } else {
            showmenuupdateupdate(true);
            let username = sessionStorage.getItem('username');
            let role = sessionStorage.getItem('userrole');
            setUserrole(role); // userrole ni o'rnatamiz

            if (username === '' || username === null) {
                usenavigate('/login');
            } else {
                displayusernameupdate(username);
            }
        }

    }, [location]);

    return (
        <div>
            {showmenu &&
                <div className="header">
                    <Link to={'/'}>Home</Link>
                    {userrole === 'admin' && <Link to={'/customer'}>Customer</Link>} {/* Admin uchun ko'rsatiladi */}
                    <span style={{ marginLeft: '70%' }}>Welcome <b>{displayusername}</b></span>
                    <Link style={{ float: 'right' }} to={'/login'}>Logout</Link>
                </div>
            }
        </div>
    );
}

export default Appheader;
