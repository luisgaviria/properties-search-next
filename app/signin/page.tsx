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

export default function SignIn(props: any){
    const router = useRouter();
    const [email,setEmail] = useAtom(emailAtom);
    const [password,setPassword] = useAtom(passwordAtom);

    const handleSignIn = async(e: React.SyntheticEvent)=>{
        e.preventDefault();

        signIn('credentials',{
          email: email, 
          password: password,
          redirect: false,
        });

        router.push("/dashboard");
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
          No tienes una cuenta? Registrate <a href="/register">Registrate</a>
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
        </Form>
      </>
    )
};