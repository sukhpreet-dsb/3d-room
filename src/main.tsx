import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
// import Room from './json/Room.tsx'
import RoomWithDoorWindow from './json/RoomWithDoorWindow.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    {/* <Room /> */}
    <RoomWithDoorWindow />
  </StrictMode>,
)
