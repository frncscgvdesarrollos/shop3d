'use client'
import { useState, useEffect } from 'react';
import Header from "../components/Header";
import { UserAuth } from "../context/AuthContext";
import { getUser } from "../firebase.js"

export default function ShopLayout({children}) {
    const {user} = UserAuth();
    const [client, setClient] = useState(null);

    useEffect(() => {
        if (user?.uid) {
            const fetchUser = new Promise((resolve, reject) => {
                getUser(user.uid).then(res => {
                    console.log("Esta es la respuesta:", res);
                    resolve(res);
                }).catch(err => {
                    reject(
                        window.location.href = '/shop/register'
                    );
                });
            });

            fetchUser.then(res => {
                setClient(res);
            }).catch(err => {
                console.error("Error fetching user:", err);
            });
        }
    }, [user?.uid]); // Solo se ejecuta cuando cambia el uid del usuario

    return (
        <div className='bg-teal-600'>
            <Header/>
            {children}
        </div>
    );
}
