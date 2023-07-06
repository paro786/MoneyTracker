import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import DataProvider from "./DataProvider";

const ProtectedRoute = ({ component: Component, ...restProps }) => {
  const { user } = useContext(AuthContext);

  return (
    <Route
      {...restProps}
      render={(...props) => {
        return user ? (
          <DataProvider>
            <Component {...props} />
          </DataProvider>
        ) : <Redirect to="/login" />;
      }}
    />
  );
};

export default ProtectedRoute