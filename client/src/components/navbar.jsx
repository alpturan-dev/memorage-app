import { NavLink } from 'react-router-dom'

function Navbar() {
    return (
        <nav className='bg-gray-100 mx-auto flex justify-center gap-3 py-4 mb-3 underline underline-offset-2'>
            <NavLink to="/">Dashboard</NavLink>
            <NavLink to="/collections">Collections</NavLink>
        </nav>
    )
}

export default Navbar