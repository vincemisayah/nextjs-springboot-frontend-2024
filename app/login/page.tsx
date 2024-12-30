'use client'

import { useState } from "react";
import { Spacer } from "@nextui-org/react";
import { useRouter } from 'next/navigation';

export default function MyHomePage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { push } = useRouter();

    const handleSubmit = async (event:any) => {
        const FormFieldInputs = {
            username: username,
            password: password,
        }

        const URL = `${process.env.NEXT_PUBLIC_BASE_URL}/login/api/validateLogin`
        try {
            await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(FormFieldInputs),
            }).then(response => {
                if (response.ok) {
                    return response.json(); // Parse the response as JSON
                } else {
                    throw new Error('Request failed with status ' + response.status);
                }
            }).then(data => {
                document.cookie = `token=${data.GeneratedToken}`;
                push('/reports');
            }).catch(error => {
                // Handle errors
                console.error(error);
            });
        } catch (error) {
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <div className={'text-center'}>
            <span className={'text-lg font-semibold'}>Sign in to Sales Commission App</span>
                <div className={'dark:bg-[#0c0c0d] bg-white flex flex-col gap-2 border-small p-3 border-default-200 dark:border-default-100 rounded m-5 shadow'}>
                        <input placeholder={'username'}
                            className={'text-center ml-2 border-small border-default-200 dark:border-default-100 rounded bg-gray-50 dark:bg-[#232327]'}
                            type="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <br />
                        <input placeholder={'password'}
                            className={'text-center ml-2 border-small border-default-200 dark:border-default-100 rounded bg-gray-50 dark:bg-[#232327]'}
                            type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <br />
                    <button onClick={handleSubmit}
                            className={'dark:bg-[#19454d] bg-[#3ab19b] text-white text-[9pt]' +
                                ' m-auto border-small px-10 py-2 border-default-200 dark:border-default-100 rounded-3xl shadow-sm w-fit'}>
                        SIGN IN
                    </button>
                </div>
        </div>
    );
}