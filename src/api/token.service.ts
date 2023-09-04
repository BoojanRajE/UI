

const SetAccessToken=(token:string)=>{
    localStorage.setItem("token", JSON.stringify(token));
}
const RefreshAccessToken=(token:string)=>{
    localStorage.setItem("refresh_token",JSON.stringify(token));
}
const setRole=(role:string)=>{
    localStorage.setItem("role", JSON.stringify(role || []));
}
const GetAccessToken=()=>{
    JSON.parse(localStorage.getItem('token') || '{}')
}

const GetRefreshToken=()=>{
    return JSON.parse(localStorage.getItem('refresh_token') || '{}')
}

const RemoveAccessToken=()=>{
    localStorage.removeItem("token");
}
const RemoveRefreshToken=()=>{
    localStorage.removeItem("refresh_token");    
}
const RemoveRole=()=>{
    localStorage.removeItem("role");
}
const TokenService={
    SetAccessToken,
    RefreshAccessToken,
    GetRefreshToken,
    setRole,
    GetAccessToken,
    RemoveAccessToken,
    RemoveRefreshToken,
    RemoveRole
}
export default TokenService