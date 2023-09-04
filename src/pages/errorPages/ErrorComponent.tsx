import React from 'react'

const ErrorComponent:React.FC<{errorName:string}>=({errorName})=>{
    return (
        <p className='text-red-slate text-lg'>{errorName}</p>
    )
}
export default ErrorComponent