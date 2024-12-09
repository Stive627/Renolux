import { Navigate, Outlet, Route } from "react-router-dom"

const ProtectedRoute = () => {
    const token = localStorage.getItem('RenoluxAdmin')
    return(
        <Route>
            {token ? <Outlet/> : <Navigate to='/login'/>}
        </Route>
    )
}
export default ProtectedRoute