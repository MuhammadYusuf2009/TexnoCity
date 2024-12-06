import { createContext, useContext, useState, useEffect } from "react";


const UserContext = createContext();


export const UserProvider = ({ children }) => {
    const [userdata, setUserdata] = useState(() => {

        const savedUserdata = localStorage.getItem("userdata");
        return savedUserdata ? JSON.parse(savedUserdata) : {
            user: [  
                {
                    id: "MuhammadYusuf",
                    name: "Qodirov",
                    password: "admin",
                    email: "kodirovmy122109@gmail.com",
                    phone: "505003950",
                    country: "India",
                    address: "dsadad",
                    role: "admin",
                    gender: "female",
                },
                {
                    id: "Biloliddin",
                    name: "Ganiyev",
                    password: "admin",
                    email: "test@gamil.com",
                    phone: "505003950",
                    country: "India",
                    address: "dsadad",
                    role: "admin",
                    gender: "female",
                },
            ],
            roleaccess: [
                {
                    role: "admin",
                    menu: "customer",
                    haveadd: true,
                    haveedit: true,
                    havedelete: true,
                    id: "e920",
                },
            ],
        };
    });

    useEffect(() => {
        localStorage.setItem("userdata", JSON.stringify(userdata));
    }, [userdata]);

    return (
        <UserContext.Provider value={{ userdata, setUserdata }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);
