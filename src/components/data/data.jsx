import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import '../css/home.css'
const Data = () => {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);

    useEffect(() => {
        const storedCustomerList = localStorage.getItem('custlist');
        if (storedCustomerList) {
            const customers = JSON.parse(storedCustomerList);
            const foundCustomer = customers.find(cust => cust.id.toString() === id);
            setCustomer(foundCustomer);
        }
    }, [id]);

    return (
        <div>
            {customer ? (
                <div className="container">
                    <div style={{ padding: "20px", borderRadius: "10px" }} className="data__border">
                        <h1>{customer.name}</h1>
                        <img src={customer.image} alt={customer.name} style={{ maxWidth: "200px", maxHeight: "200px" }} />
                        <div className="data__text">
                            <p>{Intl.NumberFormat().format(customer.price)} So`m</p>
                            <p>{Intl.NumberFormat().format((customer.price / 29).toFixed(0))} So`m</p>
                        </div>
                        <div className="data__text2">
                            <i>hello</i>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Ma'lumot topilmadi.</p>
            )}
            {/* <Link to={'/'}><button>back</button></Link> */}

        </div>
    );
};

export default Data;
