import { Client, ID, Databases, Storage } from "appwrite";
import credentials from "./credentials";

class UserService {
  client = new Client();
  database;
  bucket;

  constructor() {
    this.client
      .setEndpoint(credentials.end_point)
      .setProject(credentials.project_id);
    this.database = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost(user_Id, { user_name, user_image, user_bio }) {
    try {
      return await this.database.createDocument(
        credentials.database_db,
        credentials.collection_user,
        user_Id,
        {
          user_name,
          user_image,
          user_bio,
        }
      );
    } catch (error) {
      console.log("Create User Profile Error", error);
      return false;
    }
  }

  async updatePost(user_Id, { user_name, user_image, user_bio }) {
    try {
      return await this.database.updateDocument(
        credentials.database_db,
        credentials.collection_user,
        user_Id,

        {
          user_name,
          user_image,
          user_bio,
        }
      );
    } catch (error) {
      console.log("Update Profile Error", error);
      return false;
    }
  }

  async deletePost({ user_Id }) {
    try {
      await this.database.deleteDocument(
        credentials.database_db,
        credentials.collection_user,
        user_Id
      );
      return true;
    } catch (error) {
      console.log("Delete Post Error", error);
      return false;
    }
  }

  async getPost({ user_Id }) {
    try {
      return await this.database.getDocument(
        credentials.database_db,
        credentials.collection_user,
        user_Id
      );
    } catch (error) {
      console.log("Get Profile Error", error);
      return false;
    }
  }

  async allPosts(queries = []) {
    try {
      return await this.database.listDocuments(
        credentials.database_db,
        credentials.collection_user,
        queries
      );
    } catch (error) {
      console.log("All Post Error", error);
      return false;
    }
  }

  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        credentials.bucket_user,
        ID.unique(),
        file
      );
    } catch (error) {
      console.log("Create | Upload Profile File Error", error);
      return false;
    }
  }

  async deleteFile(file_Id) {
    try {
      await this.bucket.deleteFile(credentials.bucket_user, file_Id);
      return true;
    } catch (error) {
      console.log("Delete Profile File Error", error);
      return false;
    }
  }

  getFilePreview(file_Id) {
    return this.bucket.getFilePreview(credentials.bucket_user, file_Id);
  }
}

const user_service = new UserService();

export default user_service;
