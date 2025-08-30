import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
      <h1 className="text-5xl font-bold text-red-500">🚀 Tailwind is working!</h1>
    </div>
    </>
  )
}

export default App
