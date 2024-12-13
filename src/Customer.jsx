import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserContext } from "./UserContext";

const Customer = () => {
    const [custlist, custupdate] = useState([]);
    const [haveedit, editchange] = useState(false);
    const [haveview, viewchange] = useState(false);
    const [haveadd, addchange] = useState(false);
    const [haveremove, removechange] = useState(false);
    const [haveupdate, updatedText] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: "", price: "", image: "" });
    const [updateIndex, setUpdateIndex] = useState(null); // Track item for update

    const navigate = useNavigate();
    const { userdata } = useUserContext();

    const GetUserAccess = useCallback(() => {
        const userrole = userdata?.role || sessionStorage.getItem('userrole') || '';
        if (!userrole) {
            navigate('/');
            return;
        }
        fetch(`http://localhost:8000/roleaccess?role=${userrole}&menu=customer`)
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
                    updatedText(userobj.haveupdt);
                } else {
                    navigate('/');
                }
            });
    }, [userdata?.role, navigate]);

    const loadcustomer = useCallback(() => {
        const storedCustomerList = localStorage.getItem('custlist');
        if (storedCustomerList) {
            custupdate(JSON.parse(storedCustomerList));
        } else {
            fetch("http://localhost:8000/customer")
                .then(res => {
                    if (!res.ok) {
                        return false;
                    }
                    return res.json();
                })
                .then(res => {
                    custupdate(res);
                    localStorage.setItem('custlist', JSON.stringify(res));
                });
        }
    }, []);

    useEffect(() => {
        GetUserAccess();
        loadcustomer();
    }, [GetUserAccess, loadcustomer]);

    const handleadd = () => {
        if (!haveadd) {
            setShowModal(true);
        }
    };

    const handleSave = () => {
        const { name, price, image } = formData;
        if (name && price && image) {
            const item = { name, price, image };
            const updatedList = [...custlist, item];
            custupdate(updatedList);
            localStorage.setItem('custlist', JSON.stringify(updatedList));
            setShowModal(false);
            setFormData({ name: "", price: "", image: "" });
            toast.success('Item added successfully!');
        } else {
            toast.warning('All fields are required!');
        }
    };

    const handleDelete = (index) => {
        if (!haveremove) {
            const updatedList = custlist.filter((_, i) => i !== index);
            custupdate(updatedList);
            localStorage.setItem('custlist', JSON.stringify(updatedList));
            toast.success('Item deleted successfully!');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdate = (index) => {
        if (!haveupdate) {
            const itemToUpdate = custlist[index];
            setFormData({ name: itemToUpdate.name, price: itemToUpdate.price, image: itemToUpdate.image });
            setUpdateIndex(index);
            setShowModal(true);
        }
    };

    const handleUpdateSave = () => {
        const { name, price, image } = formData;
        if (name && price && image && updateIndex !== null) {
            const updatedList = [...custlist];
            updatedList[updateIndex] = { name, price, image };  // Update the item
            custupdate(updatedList);
            localStorage.setItem('custlist', JSON.stringify(updatedList));
            setShowModal(false);
            setFormData({ name: "", price: "", image: "" });
            setUpdateIndex(null);
            toast.success('Item updated successfully!');
        } else {
            toast.warning('All fields are required!');
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
                    <div style={{ marginTop: "20px" }}>
                        {custlist.map((item, index) => (
                            <div key={index} style={{
                                border: "1px solid #ccc",
                                padding: "10px",
                                marginBottom: "10px",
                                borderRadius: "5px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                <div>
                                    <h4>{item.name}</h4>
                                    <p>Price: {Intl.NumberFormat().format(item.price)} UZS</p>
                                    <img src={item.image} alt={item.name} style={{ maxWidth: "100px", maxHeight: "100px" }} />
                                </div>
                                <div>
                                    <button onClick={() => handleUpdate(index)} className="btn btn-warning">Update</button>
                                    <button onClick={() => handleDelete(index)} className="btn btn-danger">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal" style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <div style={{
                        backgroundColor: "#fff",
                        padding: "20px",
                        borderRadius: "5px",
                        width: "300px",
                        textAlign: "center"
                    }}>
                        <h4>{updateIndex !== null ? 'Update Item' : 'Add New Item'}</h4>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            style={{ display: "block", margin: "10px 0", width: "100%" }}
                        />
                        <input
                            type="text"
                            name="price"
                            placeholder="Price"
                            value={formData.price}
                            onChange={handleInputChange}
                            style={{ display: "block", margin: "10px 0", width: "100%" }}
                        />
                        <input
                            type="text"
                            name="image"
                            placeholder="Image URL"
                            value={formData.image}
                            onChange={handleInputChange}
                            style={{ display: "block", margin: "10px 0", width: "100%" }}
                        />
                        <button onClick={updateIndex !== null ? handleUpdateSave : handleSave} className="btn btn-primary" style={{ marginRight: "10px" }}>
                            {updateIndex !== null ? 'Save Changes' : 'Save'}
                        </button>
                        <button onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customer;
