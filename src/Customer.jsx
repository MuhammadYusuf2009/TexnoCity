import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserContext } from "./UserContext";

const Customer = () => {
    const [custlist, custupdate] = useState([]);
    const [haveedit, editchange] = useState(false);
    const [haveview, viewchange] = useState(false);
    const [haveadd, addchange] = useState(false);
    const [haveremove, removechange] = useState(false);

    const navigate = useNavigate();

    const { userdata } = useUserContext();

    useEffect(() => {
        GetUserAccess();
        loadcustomer();
    }, []);

    const GetUserAccess = () => {
        const userrole = userdata?.role || sessionStorage.getItem('userrole') || '';
        if (!userrole) {
            navigate('/');
            return;
        }
        fetch("http://localhost:8000/roleaccess?role=" + userrole + "&menu=customer")
            .then(res => {
                if (!res.ok) {
                    navigate('/');
                    return false;
                }
                return res.json();
            })
            .then(res => {
                if (res.length > 0) {
                    viewchange(true);
                    let userobj = res[0];
                    editchange(userobj.haveedit);
                    addchange(userobj.haveadd);
                    removechange(userobj.havedelete);
                } else {
                    navigate('/');
                }
            });
    };

    const loadcustomer = () => {
        fetch("http://localhost:8000/customer")
            .then(res => {
                if (!res.ok) {
                    return false;
                }
                return res.json();
            })
            .then(res => {
                custupdate(res);
            });
    };

    const handleadd = () => {
        if (haveadd) {
            toast.success('added');
        } else {
            toast.warning('You do not have access to add');
        }
    };

    const handleedit = () => {
        if (haveedit) {
            toast.success('edited');
        } else {
            toast.warning('You do not have access to edit');
        }
    };

    const handleremove = () => {
        if (haveremove) {
            toast.success('removed');
        } else {
            toast.warning('You do not have access to remove');
        }
    };

    return (
        <div className="container">
            <div className="card">
                <div className="card-header">
                    <h3>Customer Listing</h3>
                </div>
                <div className="card-body">
                    <button onClick={handleadd} className="btn btn-success">Add (+)</button>
                    <br />
                    <table className="table table-bordered">
                        <thead className="bg-dark text-white">
                            <tr>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {custlist &&
                                custlist.map(item => (
                                    <tr key={item.code}>
                                        <td>{item.code}</td>
                                        <td>{item.name}</td>
                                        <td>{item.email}</td>
                                        <td>
                                            <button onClick={handleedit} className="btn btn-primary">Edit</button> |
                                            <button onClick={handleremove} className="btn btn-danger">Remove</button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Customer;
