import { useFormik } from "formik";
import { Link, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { SiGoogle } from "react-icons/si";
import { useLogin } from "../hooks/useAuthQueries";
import { loginSchema, type LoginFormData } from "../utils/validation";
import { toFormikValidationSchema } from "../utils/zod-formik-adapter";
import { env } from "../utils/env";
import { ErrorAlert } from "../Components/ErrorAlert";

function Login() {
  const loginMutation = useLogin();
  const [searchParams, setSearchParams] = useSearchParams();
  const [oauthError, setOauthError] = useState<string | null>(null);

  const oauthHref = `${env?.VITE_API_URL}auth/google`

  const isOAuthConfigured = Boolean(oauthHref);
  const configError = !isOAuthConfigured
    ? "API URL is not configured. Please check your environment configuration."
    : null;

  const messageMap: Record<string, string> = {
    access_denied: "You cancelled Google sign-in.",
    timeout: "Google sign-in timed out. Please try again.",
    no_email:
      "Email access is required for Google Sign-In. Please try again and grant email access.",
  };

  const oauthFailed = searchParams.get("oauth_failed");
  useEffect(() => {
    if (!oauthFailed) return;
    const isKnown = oauthFailed in messageMap;
    const message = isKnown
      ? messageMap[oauthFailed]
      : "An error occurred during Google Sign-In. Please try again.";
    setOauthError(message);
    if (!isKnown && import.meta.env.DEV) {
      // Unknown oauth_failed
    }
    setSearchParams(
      (prev: URLSearchParams) => {
        const next = new URLSearchParams(prev);
        next.delete("oauth_failed");
        return next;
      },
      { replace: true }
    );
  }, [oauthFailed, setSearchParams]);

  const formik = useFormik<LoginFormData>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: toFormikValidationSchema(loginSchema),
    onSubmit: (values: LoginFormData) => {
      loginMutation.mutate(values);
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
            >
              create a new account
            </Link>
          </p>
        </div>

        {/* OAuth Error Display */}
        {oauthError && <ErrorAlert>{oauthError}</ErrorAlert>}

        {/* Configuration Error Display (development only) */}
        {import.meta.env.DEV && configError && (
          <ErrorAlert>{configError}</ErrorAlert>
        )}

        {/* Google Sign-in Button */}
        {isOAuthConfigured ? (
          <button
            type="button"
            onClick={() => window.location.replace(oauthHref)}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-label="Sign in with Google"
          >
            <SiGoogle className="h-5 w-5" aria-hidden="true" />
            Sign in with Google
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            title="Google sign-in is not configured"
          >
            <SiGoogle className="h-5 w-5" aria-hidden="true" />
            Sign in with Google
          </button>
        )}

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 text-gray-500">
              Or continue with email
            </span>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${formik.touched.email && formik.errors.email
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:z-10 sm:text-sm`}
                placeholder="Enter your email address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${formik.touched.password && formik.errors.password
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:z-10 sm:text-sm`}
                placeholder="Enter your password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.password}
                </p>
              )}
            </div>
          </div>

          {/* Error Display */}
          {loginMutation.error && (
            <ErrorAlert>
              {loginMutation.error.message || "Login failed. Please try again."}
            </ErrorAlert>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={
                loginMutation.isPending || !formik.isValid || !formik.dirty
              }
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
