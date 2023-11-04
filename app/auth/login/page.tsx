"use client";
import { atom, useAtom } from "jotai";
import { signIn } from "next-auth/react";
import { Form,Button } from "react-bootstrap";
import styles from "./page.module.scss";
import { useRouter } from "next/navigation";

const emailAtom = atom<string>('');
emailAtom.debugLabel = "email";
const passwordAtom = atom<string>('');
passwordAtom.debugLabel = "password";
const errorAtom = atom<string>('');
errorAtom.debugLabel = "error";

export default function Login(props: any){
    const router = useRouter();
    const [email,setEmail] = useAtom(emailAtom);
    const [password,setPassword] = useAtom(passwordAtom);
    const [error,setError] = useAtom(errorAtom);

    const handleSignIn = async(e: React.SyntheticEvent)=>{
        e.preventDefault();
        const res = await signIn('credentials',{
          email: email, 
          password: password,
          redirect: false,
        });

        if(res?.error){
          setError("Wrong Credentials");
        }
        else { 
          router.push("/profile");
        }
  
    };

    const handleInput = async(e: React.ChangeEvent<HTMLInputElement>)=>{
       if(e.target.name=='password'){ 
        setPassword(e.target.value);    
       }
       else { 
        setEmail(e.target.value);
       }
    };

    return (
        <>
        <h2>
          No tienes una cuenta? Registrate <a href="/auth/register">Registrate</a>
        </h2>
        <Form className={styles["form_login"]}>
          <Form.Group className={styles["form_field"]}>
            <Form.Control
              name="email"
              type="text"
              placeholder="Usuario o Correo"
              value={email}
              onChange={handleInput}
            />
          </Form.Group>
          <Form.Group className={styles["form_field"]}>
            <Form.Control
              name="password"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={handleInput}
            />
          </Form.Group>
          <Button
            onClick={handleSignIn}
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