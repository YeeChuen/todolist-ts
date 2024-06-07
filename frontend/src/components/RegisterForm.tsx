import React from 'react'

const RegisterForm = () => {
  return (
    <form>
        <label>
            Username:
            <input type='text' name='name'/>
        </label>
        <br/>
        
        <label>
            Password:
            <input type='password' name='name'/>
        </label>
        <br/>
        <input type="submit" value="Register"/>
    </form>
  )
}

export default RegisterForm