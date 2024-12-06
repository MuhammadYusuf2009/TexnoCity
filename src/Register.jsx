import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserContext } from "./UserContext";

const Register = () => {
    const { userdata, setUserdata } = useUserContext();
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [country, setCountry] = useState("Uzbekiston");
    const [address, setAddress] = useState("");
    const [gender, setGender] = useState("female");

    const navigate = useNavigate();
    console.log(userdata.user);

    const validate = () => {
        if (!id || !name || !password || !email) {
            toast.warning('Please fill in all required fields');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.warning('Invalid email format');
            return false;
        }
        return true;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        
        const newUser = {
            id,
            name,
            password,
            email,
            phone,
            country,
            address,
            gender,
            role: "user", 
        };

        
        setUserdata({
            ...userdata,  
            user: [...userdata.user, newUser],  
        });

        toast.success("Ro'yxatdan o'tish muvaffaqiyatli");

        navigate("/login");
    };


    return (
        <div className="row">
            <div className="offset-lg-3 col-lg-6" style={{ marginTop: "100px" }}>
                <form onSubmit={handleSubmit} className="container">
                    <div className="card">
                        <div className="card-header">
                            <h2>User Registration</h2>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label>User ID</label>
                                <input
                                    value={id}
                                    onChange={(e) => setId(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label>Country</label>
                                <select
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    className="form-control"
                                >
                                    <option>Uzbekiston</option>
                                    <option>India</option>
                                    <option>USA</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label>Gender</label>
                                <input
                                    type="radio"
                                    checked={gender === "male"}
                                    onChange={() => setGender("male")}
                                /> Male
                                <input
                                    type="radio"
                                    checked={gender === "female"}
                                    onChange={() => setGender("female")}
                                /> Female
                            </div>
                        </div>
                        <div className="card-footer">
                            <button type="submit" className="btn btn-primary">Register</button>
                            <Link to="/login" className="btn btn-danger">Back</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
