"use client";
import Link from "@/node_modules/next/link";
import { Container } from "@/node_modules/react-bootstrap/esm/index";
import { Nav } from "@/node_modules/react-bootstrap/esm/index";
import { Navbar } from "@/node_modules/react-bootstrap/esm/index";
import styles from "./Navbar.module.scss";
import { Button } from "react-bootstrap";
import { useSession, signOut } from "next-auth/react";
import DarkModeToggle from "../ToogleThemeButton/ToogleThemeButton";

const NavBar = (props: any) => {
  const { data, status }: { data: any; status: any } = useSession();

  const handleLogOut = async () => {
    await signOut();
  };
  return (
    <Navbar
      className={styles["navbar-properties"]}
      collapseOnSelect
      expand="md"
      // bg="light"
      // variant="light"
      // fixed="top"
    >
      <Container>
        {/* <Navbar.Brand href="/">Propiedades</Navbar.Brand> */}

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className={styles["nav-link-items"]}>
            {/* <Nav.Link href="/">Home</Nav.Link> */}
            <Link href="/">Home</Link>
            {/* <Nav.Link href="/search">Search</Nav.Link> */}
            <Link href="/search">Search</Link>

            {/* <Nav.Link href={localStorage.getItem("token") ? "/form" : "/login"}>
                  Manage Listings
                </Nav.Link> */}
          </Nav>
        </Navbar.Collapse>
        {/* {localStorage.getItem("token") ? (
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              <p
                style={{ cursor: "pointer" }}
                onClick={() => {
                  // localStorage.removeItem("token");
                  window.location.reload();
                }}
              >
                Logout
              </p>
            </Nav>
          </Navbar.Collapse>
        ) : (
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              <Nav.Link href="/register">Register</Nav.Link>
              <Nav.Link href="/login">Login</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        )} */}
        {data?.user.email.length ? (
          <>
            <Nav.Link href="/profile">Profile</Nav.Link>
            <Button variant="black" onClick={handleLogOut}>
              Log Out
            </Button>
          </>
        ) : (
          <Navbar.Collapse className="justify-content-end mr-3">
            <Nav>
              {/* <Nav.Link
                className="text-gray-900 dark:text-white"
                href="/auth/register"
              >
                Register
              </Nav.Link> */}
              {/* <Nav.Link
                className="text-gray-900 dark:text-white mr4"
                href="/auth/login"
              >
                Login
              </Nav.Link> */}
            </Nav>
          </Navbar.Collapse>
        )}
        <DarkModeToggle />
      </Container>
    </Navbar>
  );
};

export default NavBar;
