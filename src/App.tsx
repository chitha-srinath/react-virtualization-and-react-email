import AppRoutes from "./routes";
import EnvironmentError from "./Pages/EnvironmentError";
import { envResult } from "./utils/env";

function App() {
  // Check if environment validation failed
  if (!envResult.success) {
    return <EnvironmentError error={envResult.error} />;
  }

  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
