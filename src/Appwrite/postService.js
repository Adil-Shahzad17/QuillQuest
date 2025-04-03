import credentials from "./credentials";
import { Client, ID, Databases, Storage, Query } from "appwrite";

class PostService {
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

  async createPost({
    user_Id,
    content,
    post_image,
    category,
    title,
    headline,
  }) {
    try {
      return await this.database.createDocument(
        credentials.database_db,
        credentials.collection_post,
        ID.unique(),
        {
          user_Id,
          content,
          post_image,
          category,
          title,
          headline,
        }
      );
    } catch (error) {
      console.log("Create Post Error", error);
      return false;
    }
  }

  async updatePost(
    post_Id,
    { content, post_image, category, title, headline }
  ) {
    try {
      return await this.database.updateDocument(
        credentials.database_db,
        credentials.collection_post,
        post_Id,
        {
          content,
          post_image,
          category,
          title,
          headline,
        }
      );
    } catch (error) {
      console.log("Update Post Error", error);
      return false;
    }
  }

  async deletePost({ post_Id }) {
    try {
      await this.database.deleteDocument(
        credentials.database_db,
        credentials.collection_post,
        post_Id
      );
      return true;
    } catch (error) {
      console.log("Delete Post Error", error);
      return false;
    }
  }

  async getPost({ post_Id }) {
    try {
      return await this.database.getDocument(
        credentials.database_db,
        credentials.collection_post,
        post_Id
      );
    } catch (error) {
      console.log("Get Post Error", error);
      return false;
    }
  }

  async allPosts(queries = []) {
    try {
      return await this.database.listDocuments(
        credentials.database_db,
        credentials.collection_post,
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
        credentials.bucket_post,
        ID.unique(),
        file
      );
    } catch (error) {
      console.log("Create | Upload File Error", error);
      return false;
    }
  }

  async deleteFile(file_Id) {
    try {
      await this.bucket.deleteFile(credentials.bucket_post, file_Id);
      return true;
    } catch (error) {
      console.log("Delete File Error", error);
      return false;
    }
  }

  getFilePreview(file_Id) {
    return this.bucket.getFilePreview(credentials.bucket_post, file_Id);
  }

  async getImage(file_Id) {
    try {
      return this.bucket.getFile(credentials.bucket_post, file_Id);
    } catch (error) {
      console.log("Get File Error", error);
      return false;
    }
  }
}

const post_service = new PostService();

export default post_service;
