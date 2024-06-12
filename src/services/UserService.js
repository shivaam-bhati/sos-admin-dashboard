import {API_BASH_URL} from '../utils/constraints'
import { toast } from 'react-toastify';

class UserService {


  async getAll() {
    try {
       const token =  localStorage.getItem('sos_jwt_loging_token');
      const response = await fetch(`${API_BASH_URL}/getAllUser`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorizationtoken': token
        }
      });

      const data = await response.json();
      if (response.ok) {
        return { success: true, data };
      } else {
        
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error during login:', error);
      return { success: false, error: 'An error occurred during connection.' };
    }
  }

  async update(body,userId) {
    try {
      console.log("body,userId>>>",body,userId)
       const token =  localStorage.getItem('sos_jwt_loging_token');
      const response = await fetch(`${API_BASH_URL}/updateUser/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'authorizationtoken': token
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('User Updated Successfully', {
          autoClose: 3000,
          theme: "colored",
          });
        return { success: true, data };
      } else {
        toast.error(data.error, {
          autoClose: 3000,
          theme: "colored",
          });
        
        return { success: false, error: data.error };
      }
    } catch (error) {
      toast.error(error, {
        autoClose: 3000,
        theme: "colored",
        });
      console.error('Error during login:', error);
      return { success: false, error: 'An error occurred during connection.' };
    }
  }


  async create(body) {
    try {
       const token =  localStorage.getItem('sos_jwt_loging_token');
      const response = await fetch(`${API_BASH_URL}/createUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorizationtoken': token
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('New User Successfully Created', {
          autoClose: 3000,
          theme: "colored",
          });
        return { success: true, data };
      } else {
        toast.error(data.error, {
          autoClose: 3000,
          theme: "colored",
          });
        
        return { success: false, error: data.error };
      }
    } catch (error) {
      toast.error(error, {
        autoClose: 3000,
        theme: "colored",
        });
      return { success: false, error: 'An error occurred during connection.' };
    }
  }

  async delete(userId) {
    try {
       const token =  localStorage.getItem('sos_jwt_loging_token');
      const response = await fetch(`${API_BASH_URL}/deleteUser/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'authorizationtoken': token
        }
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('User Successfully Deleted', {
          autoClose: 3000,
          theme: "colored",
          });
        return { success: true, data };
      } else {
        toast.error(data.error, {
          autoClose: 3000,
          theme: "colored",
          });
        
        return { success: false, error: data.error };
      }
    } catch (error) {
      toast.error(error, {
        autoClose: 3000,
        theme: "colored",
        });
      return { success: false, error: 'An error occurred during connection.' };
    }
  }



  async getByIsActive(isActive) {
    try {
       const token =  localStorage.getItem('sos_jwt_loging_token');
      const response = await fetch(`${API_BASH_URL}/getAllUsersByIsActive/${isActive}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorizationtoken': token
        }
      });

      const data = await response.json();
      if (response.ok) {
        return { success: true, data };
      } else {
        
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error during login:', error);
      return { success: false, error: 'An error occurred during connection.' };
    }
  }

}

export default new UserService();
