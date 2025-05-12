import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from "../src/App.jsx"
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render
(
  //<StrictMode>

    <BrowserRouter basename="/CalFriend">

      <App/>

    </BrowserRouter>

  //</StrictMode>,
)
