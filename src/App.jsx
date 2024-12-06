import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { UserProvider } from './UserContext';
import Appheader from './Appheader';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Customer from './Customer';
import UserList from './UserList';

function App() {
    return (
        <UserProvider>
            <div className="App">
                <ToastContainer theme="colored" position="top-center" />
                <BrowserRouter>
                    <Appheader />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/customer_code_custom" element={<Customer />} />
                        <Route path="/users__data_code" element={<UserList />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </UserProvider>
    );
}

export default App;
