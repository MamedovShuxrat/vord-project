import axios from "axios";

const authRegister = "https://natalietkachuk.pythonanywhere.com/auth/register/";
const authLogin = "https://natalietkachuk.pythonanywhere.com/auth/login/";

export const registerUser = async (name, email, password, confirmPassword) => {
  try {
    const response = await axios.post(authRegister, {
      username: name,
      email: email,
      password1: password,
      password2: confirmPassword
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    }
    throw new Error("An unexpected error occurred.");
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(authLogin, { email, password });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    }
    throw new Error("An unexpected error occurred.");
  }
};
