'use client'

import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { CiLogin } from "react-icons/ci";

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [bothFieldsFilled, setbothFieldsFilled] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [validCredentials, setValidCredentials] = useState<boolean>(false);

    const { push } = useRouter();

    useEffect(() => {
        setbothFieldsFilled(username.length > 0 && password.length > 0);
    },[username, password]);


    const handleSubmit = async (event:any) => {
        const FormFieldInputs = {
            username: username,
            password: password,
        }

        const URL = `${process.env.NEXT_PUBLIC_BASE_URL}/login/api/validateLogin`
        try {
            const res = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(FormFieldInputs),
            })
            const data = await res.json();

            if(data.status === 200){
                setValidCredentials(true);
                setMessage('User found. Signing in.')
                setShowMessage(true);

                localStorage.setItem('Fullname', data.fullname);
                localStorage.setItem('userID', data.userID);
                push('/reports');

                setTimeout(() => {
                    localStorage.setItem('Fullname', data.fullname);
                    localStorage.setItem('userID', data.userID);
                    push('/reports');
                }, 2000);
            }else{
                setValidCredentials(false);
                setMessage('Invalid Credentials')
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false);
                }, 2000);
            }
        } catch (error) {
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <div className={'text-center'}>
            <span className={'text-lg font-semibold'}>Invoice Commission App</span>
            <div className={'dark:bg-[#0c0c0d] bg-white flex flex-col gap-2 border-small p-3 border-default-200 dark:border-default-100 rounded m-5 shadow'}>
                <input placeholder={'username'}
                       className={'text-center ml-2 border-small border-default-200 dark:border-default-100 rounded bg-gray-50 dark:bg-[#232327]'}
                       type="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <br />
                <input placeholder={'password'}
                       className={'text-center ml-2 border-small border-default-200 dark:border-default-100 rounded bg-gray-50 dark:bg-[#232327]'}
                       type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <br />
                <button onClick={handleSubmit} disabled={!bothFieldsFilled}
                        className={'dark:bg-[#19454d] bg-[#3ab19b] text-white text-[9pt]' +
                            ' m-auto border-small px-10 py-2 border-default-200 dark:border-default-100 rounded-3xl shadow-sm w-fit'}>
                    <div className={"flex items-center space-x-2"}>
                        <CiLogin size={17} />
                        <span>Sign In</span>
                    </div>
                </button>
            </div>
            {showMessage?(
                <div>
                    <span>{message}</span>
                    {validCredentials?(
                        <div className={'mt-2'}>
                            <Spinner color={'success'}/>
                        </div>
                    ):null}
                </div>
            ):null}
        </div>
    );
}