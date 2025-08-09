import { AlertTriangle, RefreshCw } from "lucide-react";

function EnvironmentError() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-mesh relative overflow-hidden bg-amber-200">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-subtle opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-destructive/5 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-card/80 backdrop-blur-xl border border-border rounded-xl shadow-lg animate-slide-up">
          <div className="p-8 space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="relative mx-auto w-24 flex items-center justify-center">
                <div className="w-full h-full bg-destructive/10 rounded-2xl flex items-center justify-center shadow-error">
                  <AlertTriangle className="w-12 h-12 text-destructive animate-bounce" />
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-error bg-clip-text">
                  Environment Setup Required
                </h1>
                <p className="text-muted-foreground text-lg">
                  Your application needs environment variables to function
                  properly
                </p>
              </div>
            </div>

            {/* Error details */}
            {/* {error && (
              <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 animate-fade-in">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-destructive mb-2">
                      Error Details:
                    </h3>
                    <pre className="text-sm text-destructive/80 whitespace-pre-wrap font-mono bg-destructive/5 p-3 rounded-lg border border-destructive/10">
                      {error}
                    </pre>
                  </div>
                </div>
              </div>
            )} */}

            {/* Instructions */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-foreground mb-3">
                  Quick Setup Guide
                </h2>
                <p className="text-muted-foreground">
                  Create a{" "}
                  <code className="bg-muted px-2 py-1 rounded font-mono text-sm">
                    .env
                  </code>{" "}
                  file in your project root and add the following configuration:
                </p>
              </div>

              {/* Environment template */}
              {/* <div className="relative group">
                <div className="bg-muted/50 border border-border rounded-xl p-4 font-mono text-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Environment Variables
                    </span>
                    <button
                      onClick={handleCopy}
                      className="h-8 px-3 text-sm font-medium rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:shadow-glow inline-flex items-center justify-center whitespace-nowrap disabled:pointer-events-none disabled:opacity-50"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1.5 text-success" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1.5" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-foreground/90 leading-relaxed">
                    {envTemplate}
                  </pre>
                </div>
              </div> */}

              {/* Steps */}
              <div className="grid gap-4">
                <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Create Environment File
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Add the{" "}
                      <code className="bg-muted px-1 rounded text-xs">
                        .env
                      </code>{" "}
                      file to your project root directory
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Configure Values
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Replace the placeholder values with your actual
                      configuration
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Restart Application
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Click the refresh button below to reload your application
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-primary hover:shadow-glow transition-all duration-300 animate-pulse-glow px-8 py-3 text-primary-foreground h-12"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Refresh Application
              </button>
            </div>

            {/* Help text */}
            <div className="text-center pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Need help? Check your project documentation or contact your
                development team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnvironmentError;
