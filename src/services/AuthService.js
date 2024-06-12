import {API_BASH_URL} from '../utils/constraints'
import { toast } from 'react-toastify';

class AuthService {
  // async login(email) {
  //   try {
  //     const response = await fetch(`${API_BASH_URL}/login`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ email }),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       // Successful login
  //       localStorage.setItem('sos-loging-token', data.token); // Store the token in localStorage
  //       return { success: true, data };
  //     } else {
  //       // Failed login
  //       return { success: false, error: data.error };
  //     }
  //   } catch (error) {
  //     console.error('Error during login:', error);
  //     return { success: false, error: 'An error occurred during login.' };
  //   }
  // }


  async getAdminByEmail(email) {
    try {
      const response = await fetch(`${API_BASH_URL}/getAdminByEmail/${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
console.log("response>>>",response);
console.log("data>>>",data)
      if (response.ok && data.admin.length>0) {
        // Successful login
        const token = response.headers.get('authorizationtoken');
        localStorage.setItem('sos_jwt_loging_token',token); // Store the token in localStorage
        return { success: true, data };
      } else {
        // Failed login
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error during login:', error);
      return { success: false, error: 'An error occurred during login.' };
    }
  }

  async createNewAdmin(body) {
    try {
      // Mock API call - replace with your actual login API call
      const response = await fetch(`${API_BASH_URL}/createAdmin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        // Successful login
        //const token = response.headers.get('authorizationtoken');
        //localStorage.setItem('sos_jwt_loging_token',token); // Store the token in localStorage
        toast.success('New Admin Created Successfully', {
          autoClose: 3000,
          theme: "colored",
          });
        return { success: true, data };
      } else {
        // Failed login
        toast.error(data.error, {
          autoClose: 3000,
          theme: "colored",
          });
        return { success: false, error: data.error };
      }
    } catch (error) {
      toast.error('An error occurred during creating new user.', {
        autoClose: 3000,
        theme: "colored",
        });
      console.error('Error during login:', error);
      return { success: false, error: 'An error occurred during login.' };
    }
  }

  async login(body) {
    try {
      // Mock API call - replace with your actual login API call
      const response = await fetch(`${API_BASH_URL}/adminLogin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        // Successful login
      console.log(response)
        const token = response.headers.get('Authorizationtoken') || response.headers.get('authorizationtoken');
        localStorage.setItem('sos_jwt_loging_token',token); // Store the token in localStorage
        toast.success('Login Successfully', {
          autoClose: 3000,
          theme: "colored",
          });
        return { success: true, data };
      } else {
        // Failed login
        toast.error(data.message, {
          autoClose: 3000,
          theme: "colored",
          });
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('An error occurred during login', {
        autoClose: 3000,
        theme: "colored",
        });
      return { success: false, error: 'An error occurred during login.' };
    }
  }

  logout() {
    // Remove the token from localStorage
    localStorage.removeItem('sos_jwt_loging_token');

  }

   isUserAuthenticated () {
        if(localStorage.getItem('sos_jwt_loging_token') != null && localStorage.getItem('sos_jwt_loging_token') != undefined){
           return true;
        }else{
            return  false;
        }
    }
}

export default new AuthService();
