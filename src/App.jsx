import { useState } from 'react'
import SignUp from './pages/SignUp'
import Login from './pages/Login'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <h1 className='text-3xl font-bold text-blue-600 p-6'>ChamaPay</h1>
     <SignUp />
    </>
  )
}

export default App
