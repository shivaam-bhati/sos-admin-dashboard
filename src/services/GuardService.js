import {API_BASH_URL} from '../utils/constraints'
import { toast } from 'react-toastify';

class GuardService {


  async getAll() {
    try {
       const token =  localStorage.getItem('sos_jwt_loging_token');
      const response = await fetch(`${API_BASH_URL}/getAllGuards`, {
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
      return { success: false, error: 'An error occurred during connection.' };
    }
  }

  async update(body,guardId) {
    try {
       const token =  localStorage.getItem('sos_jwt_loging_token');
      const response = await fetch(`${API_BASH_URL}/updateGuard/${guardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'authorizationtoken': token
        },
        body: JSON.stringify({updatedData:body}),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Guard Updated Successfully', {
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


  async create(body) {
    try {
       const token =  localStorage.getItem('sos_jwt_loging_token');
      const response = await fetch(`${API_BASH_URL}/createGuard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorizationtoken': token
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('New Guard Successfully Created', {
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

  async delete(guardId) {
    try {
       const token =  localStorage.getItem('sos_jwt_loging_token');
      const response = await fetch(`${API_BASH_URL}/deleteGuard/${guardId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'authorizationtoken': token
        }
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Guard Successfully Deleted', {
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

}

export default new GuardService();
