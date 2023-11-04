'use client'
import {Form,Button} from "react-bootstrap";
import {useRouter} from "next/navigation";
import { atom, useAtom } from "jotai";
import styles from "./page.module.scss";

interface stateInt {
    email: string; 
    username: string; 
    password: string;
    phoneNumber: string;
};

const errorAtom = atom<string>('');

errorAtom.debugLabel = "errorAtom";

const stateAtom = atom<stateInt>({
    email: "",
    username: "",
    password: "",
    phoneNumber: ""
});

stateAtom.debugLabel = "Register State Atom";

export default function Register(props:any){
    const router = useRouter(); 
    const [state,setState] = useAtom(stateAtom);
    const [error,setError] = useAtom(errorAtom); 

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>)=>{
        event.preventDefault(); 

        setState(prevState=>{
            return {
                ...prevState,
                [event.target.name]: event.target.value
            }
        });
    }

    const handleButtonClick = async(event: React.FormEvent)=>{
        event.preventDefault(); 

        try {
            const res = await fetch(`/api/register`,{
                cache: "no-store",
                headers: {
                    "Content-Type": "application/json"
                },
                method: 'POST',
                body: JSON.stringify(state)
            }).then(res=>res.json());

            router.push('/auth/login');
        }
        catch(err){
            // console.log(err);
            setError("Error");
        }
    };

    return (
        <>
            <h1>Register</h1>
            <Form>
                <Form.Group className={styles["form_field"]}>
                    <Form.Control
                        name="email"
                        type="text"
                        placeholder="Type your email"
                        value={state.email}
                        onChange={handleInput}
                    />
                </Form.Group>
                <Form.Group className={styles["form_field"]}>
                    <Form.Control
                        name="username"
                        type="text"
                        placeholder="Type your username"
                        value={state.username}
                        onChange={handleInput}
                    />
                </Form.Group>
                <Form.Group className={styles["form_field"]}>
                    <Form.Control
                        name="phoneNumber"
                        type="text"
                        placeholder="Type your Phone Number(optional)"
                        value={state.phoneNumber}
                        onChange={handleInput}
                    />
                </Form.Group>
                <Form.Group className={styles["form_field"]}>
                    <Form.Control
                        name="password"
                        type="password"
                        placeholder="Type your password"
                        value={state.password}
                        onChange={handleInput}
                    />
                </Form.Group>
                <Button
                    onClick={handleButtonClick}
                    variant="primary"
                    type="submit"
                    className={styles["button_submit"]}
                >
                    Ingresar
                </Button>
                <h2 style={{color: 'red'}}>{error}</h2>
            </Form>
        </>
    )
};