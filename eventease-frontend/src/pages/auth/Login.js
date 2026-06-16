import { useState } from 'react';
import { loginUser } from '../../services/authService';

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await loginUser(email, password);

        console.log(result);
        
        setMessage(result);
    };

    return (
        <div className="container mt-5">

            <h2>Login</h2>

            <form onSubmit={handleSubmit}>

                <div className="mb-3">
                    <label>Email</label>

                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />
                </div>

                <div className="mb-3">
                    <label>Password</label>

                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />
                </div>

                <button
                    className="btn btn-primary"
                    type="submit"
                >
                    Login
                </button>

            </form>

            {
                message &&
                <p className="mt-3">
                    {message}
                </p>
            }

        </div>
    );
}

export default Login;