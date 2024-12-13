import { useEffect, useState } from "react";

const Home = () => {
    const [customerlist, listupdate] = useState([]);

    useEffect(() => {
        const storedCustomerList = localStorage.getItem('custlist');
        if (storedCustomerList) {
            listupdate(JSON.parse(storedCustomerList));
        }
    }, []);



    return (
        <div>
            <div style={{ marginTop: "20px" }}>
                {customerlist && customerlist.length > 0 ? (
                    customerlist.map((item, index) => (
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
                        </div>
                    ))
                ) : (
                    <p></p>
                )}
            </div>
        </div>
    );
};

export default Home;
