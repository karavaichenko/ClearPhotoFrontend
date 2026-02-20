import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectUserState } from "../Store/selectors";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({
  children,
}: ProtectedRouteProps) => {
    const userState = useSelector(selectUserState);

    if (userState.resultCode === 10) {
        return <Navigate to="/login"/>
    } else {
        return <>{children}</>;
    }

};