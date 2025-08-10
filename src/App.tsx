import AppRoutes from "./routes";
import EnvironmentError from "./Pages/EnvironmentError";
import { envResult } from "./utils/env";
import { AuthInitializer } from "./components/AuthInitializer";

function App() {
  // Check if environment validation failed
  if (!envResult.success) {
    return <EnvironmentError />;
  }

  return (
    <AuthInitializer>
      <AppRoutes />
    </AuthInitializer>
  );
}

export default App;
