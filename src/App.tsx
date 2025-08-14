import AppRoutes from "./routes";
import EnvironmentError from "./Pages/EnvironmentError";
import { envResult } from "./utils/env";
import { AuthProvider } from "./Components/AuthProvider";

function App() {
  // Check if environment validation failed
  if (!envResult.success) {
    return <EnvironmentError />;
  }

  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
