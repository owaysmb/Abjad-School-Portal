import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import './Login.css'

import { AxiosError } from 'axios';

export function LoginPage() {
    const auth = useAuth()
    const { login } = auth! 
    
    const [email,setEmail] = useState('');
    const [password , setPassword] = useState("");
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const onFormSubmit = async (e: React.FormEvent) => {


      e.preventDefault()
      try {
          const user = await login(email, password)
          if (user.role === 'ADMIN') navigate('/admin')
          else if (user.role === 'TEACHER') navigate('/teacher')
          else if (user.role === 'STUDENT') navigate('/student')
          else if (user.role === 'PARENT') navigate('/parent')
      }  catch (error: unknown) {

          const err = error as AxiosError;
          const status = err.status || err.response?.status;

          if (status === 423) {
            setError("Account locked for 15 minutes");
          } else {
            setError("Invalid email or password");
          }
        }
    }

  return (  
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <span className="login-logo-text">A</span>
          </div>
          <h1 className="login-title">Abjad School Portal</h1>
          <p className="login-subtitle">Sign in to your account</p>
        </div>
    
        <form className="login-form" onSubmit={onFormSubmit}>

            <div className="login-field">
                <label className="login-label" htmlFor="email">
                Email address
                </label>
                <input
                className="login-input"
                type="email"
                id="email"
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className="login-field">
                <label className="login-label" htmlFor="password">
                Password
                </label>
                <input
                className="login-input"
                type="password"
                id="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <div className="login-options">
                <label className="login-remember">
                <input type="checkbox" />
                Remember me
                </label>
                <a className="login-forgot" href="#">
                Forgot password?
                </a>
            </div>

            <button className="login-button" type="submit">
                Sign in
            </button>

        </form>

        <div className="login-footer">
          <p className="login-footer-text">
            Contact your administrator for account access
          </p>
        </div>
        {error && <p className="login-error">{error}</p>}
      </div>
      
    </div>
  )
}
