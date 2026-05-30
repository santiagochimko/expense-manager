import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AppRoutes from "./app/routes.jsx";
import { loadCurrentUser } from "./features/auth/authThunks.js";
import { selectIsAuthenticated } from "./features/auth/authSelectors.js";

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadCurrentUser());
    }
  }, [dispatch, isAuthenticated]);

  return <AppRoutes />;
};

export default App;