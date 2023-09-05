"use client";

import { Container } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import styles from "./Navbar.module.scss";

const NavBar = (props: any) => {
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
          <Nav className="me-auto">
            <Nav.Link href="/home">Home</Nav.Link>
            <Nav.Link href="/buy">Search</Nav.Link>
            {/* <Nav.Link href={localStorage.getItem("token") ? "/form" : "/login"}>
                  Manage Listings
                </Nav.Link> */}
          </Nav>
        </Navbar.Collapse>
        {localStorage.getItem("token") ? (
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
        )}
      </Container>
    </Navbar>
  );
};

export default NavBar;
