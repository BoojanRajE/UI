import api from "./index";
import {  } from "../reducer/homeReducer";

const getData= () => api.get("/course");
const addData= (data: any) => api.post("/course", data);
export { getData, addData };
