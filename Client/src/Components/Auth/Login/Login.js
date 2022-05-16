import 'bootstrap/dist/css/bootstrap.min.css';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import googleIcon from '../../../assets/Images/googleIcon.svg';
import axios from 'axios';

const Login = props => {
    let navigate = useNavigate();
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const[errors, setErrors] = useState([]);

    const handleEmailChange = (event) => {
        const mail = event.target.value;
        setEmail(mail);
    }

    const handlePasswordChange = (event) => {
        const pass = event.target.value;
        setPassword(pass);
    }

    const loginUser = async (event) => {
        event.preventDefault();
        // if(confirmPassword !== password)
        //     window.alert('Passwords do not match!!');
        // else{
            // fetch('http://localhost:8080/users', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         email: email,
            //         password: password
            //     })
            // })
            // .then(res => {
            //     if(res.ok)
            //         navigate('/login');
            // })
            // .catch(err => console.log(err));
            try{
                const response = await axios.post('http://localhost:8080/users/login', {
                    email: email,
                    password: password,
                });
                if(response.status === 200){
                    localStorage.setItem('token', response.data.token);
                    navigate('/thanks');
                }
            }
            catch(err){
                console.log(err);
                if(err.response.status === 401)
                    window.alert('Please enter a valid password!!!')
                else if(err.response.status === 400)
                    window.alert('Email not found!!!');
                else if(err.response.status === 500)
                    window.alert('Internal server error, please refresh the page or try again!!!');
            }
    }
    // }

    return (
        <section className={styles.wrapper} id = 'wrapper1'>
            <div className="container">
                <div className=" col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4 text-center">
                        <form className="rounded bg-white shadow p-5" onSubmit = {loginUser}>

                            <h3 class="text-dark fw-bolder fs-4 mb-2">Sign In</h3>
                            <div class="fw-normal text-muted mb-4">
                                New Here? <a href="/" class="text-primary fw-vold text-decoration-none">Create an Account</a>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" value = {email} onChange = {handleEmailChange}/>
                                <label for="floatingInput">Email address</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="floatingInput" placeholder="Password" value = {password} onChange = {handlePasswordChange}/>
                                <label for="floatingInput">Password</label>
                            </div>
                            <div class="mt-2 text-end">
                              <a href="#" class="text-primary fw-bold text-decoration-none">Forget Password?</a>
                            </div>
                            
                            <button type="submit" className={["btn btn-primary w-100 my-3", styles['submit-info']].join(' ')}>Continue</button>
                            {/* <a href="#" class={["btn btn-light w-100 mb-3", styles['login-with']].join(' ')}>
                                <img src={googleIcon} className="img-fluid me-3" />Continue with Google
                            </a> */}
                        </form>
                </div>
            </div>
        </section>
    );
}

export default Login;