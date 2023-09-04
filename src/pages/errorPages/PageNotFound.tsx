import React from 'react'

function PageNotFound() {
  return (
    <div className="flex flex-col h-screen justify-center items-center ">
        <div>
            <h1 className='text-9xl text-slate-800'>404</h1>
        </div>
        <div>
            <p className='text-xl text-center' >The page you are looking for was not found.</p>
        </div>
        <div>
            <a href="/" className='text-xl text-sky-500 underline underline-offset-4' >Back to Home</a>
        </div>
    </div>
  )
}

export default PageNotFound;