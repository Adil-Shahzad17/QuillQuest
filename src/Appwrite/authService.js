import { Client, Account, ID, OAuthProvider } from "appwrite";
import credentials from "./credentials";

class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(credentials.end_point)
      .setProject(credentials.project_id);
    this.account = new Account(this.client);
  }

  async createAccount({ email, password }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password
      );
      if (userAccount) {
        return this.generate_getOTPToken(email);
      } else {
        return userAccount;
      }
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      throw error;
    }
  }

  async generate_getOTPToken(email) {
    try {
      return await this.account.createEmailToken(ID.unique(), email);
    } catch (error) {
      throw error;
    }
  }

  async loginUsingOTP({ user_Id, otpToken }) {
    try {
      return await this.account.createSession(user_Id, otpToken);
    } catch (error) {
      console.log(error.message);
      return error;
    }
  }

  async getCurrentUser() {
    try {
      const user = await this.account.get();
      return user;
    } catch (error) {
      if (error.code === 401) {
        console.log(
          "Unauthorized: Please ensure the user is logged in and has the necessary permissions."
        );
      }
    }
  }

  async logOut() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.log("LogOut Error", error);
      throw error;
    }
  }
}

const authservice = new AuthService();

export default authservice;
