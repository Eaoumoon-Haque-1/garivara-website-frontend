import { Outlet } from 'react-router-dom'
import Footer from '../components/shared/Footer/Footer'
import Navbar from '../components/shared/Navbar/Navbar'

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-950">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default RootLayout

