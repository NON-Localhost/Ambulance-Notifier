import 'bootstrap/dist/css/bootstrap.min.css';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Signup.module.css';
// import googleIcon from '../../../assets/Images/googleIcon.svg';
import axios from 'axios';

const Signup = props => {
    let navigate = useNavigate();
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    let check = false;

    const handleEmailChange = (event) => {
        const mail = event.target.value;
        setEmail(mail);
    }

    const handlePasswordChange = (event) => {
        const pass = event.target.value;
        setPassword(pass);
    }

    const handleConfirmPasswordChange = (event) => {
        const cPass = event.target.value;
        setConfirmPassword(cPass);
    }
    const handleCheckChange = (event) => {
        check = event.target.checked;
        console.log(check);
    }


    const signupUser = async (event) => {
        event.preventDefault();
        if(confirmPassword !== password)
            window.alert('Passwords do not match!!');
        else{
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
                const response = await axios.post('http://localhost:8080/users', {
                    email: email,
                    password: password,
                    check:check
                });
                console.log(response);
                if(response.status === 201)
                    return navigate('/login');
            }
            catch(err){
                console.log(err);
                if(err.response.status === 403){
                    console.log(err.response);
                    window.alert('Email already exists!!!');
                }
                // throw new Error('signup failed!!!');
            }
        }
    }

    return (
        <section className={styles.wrapper} id = 'wrapper1'>
            <div className="container">
                <div className=" col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4 text-center">
                        <form className="rounded bg-white shadow p-5" onSubmit = {signupUser}>
                            <h3 className="text-dark fw-bolder fs-4 mb-2">Ambulance Notifier</h3>
                            <div className="fw-normal text-muted mb-4">
                                Already have an account? <a href="/login" className="text-primary fw-vold text-decoration-none">Sign in here</a>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" value = {email} onChange = {handleEmailChange}/>
                                <label for="floatingInput">Email address</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="floatingInput" placeholder="Password" value = {password} onChange = {handlePasswordChange}/>
                                <label for="floatingInput">Password</label>
                            </div>
                            <span className= {[styles['password-info'], "mt-2"].join(' ')}>
                                *Use 8 or more characters with a mix of letters & numbers only.
                            </span>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="floatingConfirmPassword" placeholder="Confirm Password" value = {confirmPassword} onChange = {handleConfirmPasswordChange}/>
                                <label for="floatingConfirmPassword">Confirm Password</label>
                            </div>
                            
                            <div className="form-check d-flex align-items-center">
                                <input className="form-check-input" type="checkbox" id="gridCheck" onChange={handleCheckChange} />
                                <label className="form-check-label ms-2" for="gridCheck">
                                    Are you an ambulance driver?
                                </label>
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

export default Signup;