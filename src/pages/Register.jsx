import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';

const Register = () => {

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault();

    if(password != confirmPassword) 
    {
      setErrorMessage("Passwords Do Not Match!")
    }
    else if(firstName === "" || lastName === "" || email === "" || password === ""|| confirmPassword === "")
    {
      setErrorMessage("Missing Fields")
    }
    else {
      fetch("https://calfriend.onrender.com/CreateUser", {
        method: "POST",
        headers: {
          "Content-Type":"application/json" },
          body: JSON.stringify({
            firstName, lastName, email, password, confirmPassword
          })
      })
      .then(response => response.json())
      .then(data=> {
        if (data.success) {
          navigate('/register');
        } else {
          setErrorMessage("Error creating account")
        }
      })
      .catch(error => console.error("Error:", error));

    }

  }

  return (

    <div>
      <RegistrationForm 
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        firstName={firstName}
        setFirstName={setFirstName}
        setLastName={setLastName}
        lastName={lastName}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        handleSubmit={handleSubmit}
        errorMessage={errorMessage}
      />

      {/* Still need to set up and make sure back end api cnnection is happening to create user in mongo */}

    </div>
    // <div class="form-1">
    //     <form id="RegisterForm">
    
    //         <label>Enter First Name:</label>
    //         <input class="input-1" type="text" id="firstNameField" name="firstNameField" /> 
    
    //         <label>Enter Last Name:</label> 
    //         <input class="input-1"  type="text" id="lastNameField" name="lastNameField" /> 
    
    //         <label>Enter Email:</label> 
    //         <input class="input-1"  type="text" id="emailField" name="emailField" /> 
    
    //         <label>Enter Password:</label> 
    //         <input class="input-1"  type="password" id="passwordField" name="passwordField" /> 
    
    //         <label>Confirm Password:</label>
    //         <input class="input-2" type="password" id="confirmPasswordField" name="confirmPasswordField" /> 
    
           
    //         <div>
    //             <button class="btn-1" type="submit" id="submit" name="submit">Create Account</button>
    //         </div>
    //         <div>
    //             <a style="display: flex; justify-content: center; align-items: center; padding-top: 6px;" href="Login.html"> Return to Login Page </a>
    //         </div>
    //     </form>
    // </div>
  )
}

export default Register;