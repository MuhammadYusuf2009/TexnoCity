import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
    const usenavigate = useNavigate();
    const [customerlist, listupdate] = useState(null);

    useEffect(() => {

    }, []);

    return (
        <div>

        </div>
    );
}

export default Home;