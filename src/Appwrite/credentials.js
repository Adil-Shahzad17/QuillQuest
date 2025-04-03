const credentials = {
  end_point: String(import.meta.env.VITE_APPWRITE_ENDPOINT),
  project_id: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  database_db: String(import.meta.env.VITE_APPWRITE_DATABASE),
  collection_post: String(import.meta.env.VITE_APPWRITE_COLLECTION_POST),
  collection_user: String(import.meta.env.VITE_APPWRITE_COLLECTION_USER),
  bucket_post: String(import.meta.env.VITE_APPWRITE_BUCKET_POST),
  bucket_user: String(import.meta.env.VITE_APPWRITE_BUCKET_USER),
};

export default credentials;
