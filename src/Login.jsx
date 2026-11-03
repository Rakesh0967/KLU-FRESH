import React from "react";
import AuthForm from "./AuthForm";
export default function Login({ onAuth }) { return <AuthForm mode="login" onAuth={onAuth} />; }
