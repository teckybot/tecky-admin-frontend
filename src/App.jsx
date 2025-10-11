import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div class="flex items-center justify-center h-screen">
        <p class="text-center text-3xl font-semibold">
          Vite + TailwindCSS + Antd Setup
        </p>
      </div>

    </>
  )
}

export default App
