import React from "react";
import AuthForm from "./AuthForm";
export default function Signup({ onAuth }) { return <AuthForm mode="signup" onAuth={onAuth} />; }
