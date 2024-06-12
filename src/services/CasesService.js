import {API_BASH_URL} from '../utils/constraints'
import { toast } from 'react-toastify';

class CasesService {


  async getAllCasesByIsActive(isActive) {
    try {
       const token =  localStorage.getItem('sos_jwt_loging_token');
      const response = await fetch(`${API_BASH_URL}/getAllCasesByIsActive/${isActive}`, {
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


  async getAll() {
    try {
       const token =  localStorage.getItem('sos_jwt_loging_token');
      const response = await fetch(`${API_BASH_URL}/getAllCases`, {
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


  async getCase(caseId) {
    try {
      const token =  localStorage.getItem('sos_jwt_loging_token');
      const response = await fetch(`${API_BASH_URL}/getCase/${caseId}`, {
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

export default new CasesService();
