import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './components/css/home.css';

const Home = () => {
    const [customerlist, listupdate] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedCustomerList = localStorage.getItem('custlist');
        if (storedCustomerList) {
            listupdate(JSON.parse(storedCustomerList));
        }
    }, []);

    const handleCardClick = (id, name) => {
        navigate(`/data_card/${name}-${id}`);
    };

    return (
        <div>
            {customerlist && customerlist.length > 0 ? (
                customerlist.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => handleCardClick(item.id, item.name)}
                        style={{
                            border: "1px solid #ccc",
                            padding: "10px",
                            marginBottom: "10px",
                            borderRadius: "5px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            cursor: 'pointer'
                        }}
                    >
                        <div>
                            <h4>{item.name}</h4>
                            <p>Price: {Intl.NumberFormat().format(item.price)} UZS</p>
                            <img src={item.image} alt={item.name} style={{ maxWidth: "100px", maxHeight: "100px" }} />
                            <p>{Intl.NumberFormat().format((item.price / 29).toFixed(0))} So`m</p>
                        </div>
                    </div>
                ))
            ) : (
                <p>Hozircha ma'lumot yo'q.</p>
            )}
        </div>
    );
};

export default Home;
