import API_PATH from "./apiPath";

const SERVERLESS_OFFLINE_API = false;

const API_ENV =
  process.env.NODE_ENV && process.env.NODE_ENV === "production"
    ? process.env.NODE_ENV
    : "development";
    
const Settings = {
  API_ROOT: API_PATH[API_ENV].API_ROOT,
};

// if(SERVERLESS_OFFLINE_API && API_ENV !== "production") Settings.API_ROOT = API_PATH["test"].API_ROOT
    
export default Settings;
