const rawOrigin = process.argv[2];

if (!rawOrigin) {
  console.error("Usage: npm run smoke -- https://your-deployment.example");
  process.exit(2);
}

let origin;
try {
  const url = new URL(rawOrigin);
  if (!(["http:", "https:"].includes(url.protocol) && url.username === "" && url.password === "")) {
    throw new Error("Invalid origin");
  }
  origin = url.origin;
} catch {
  console.error("Provide a valid HTTP(S) deployment origin.");
  process.exit(2);
}

const checks = [
  { path: "/search", status: 200 },
  { path: "/login", status: 200 },
  { path: "/register", status: 200 },
  { path: "/profile", status: 307, location: "/login" },
  { path: "/auth/callback", status: 307, location: "/login?confirmation=failed" },
  { path: "/this-page-does-not-exist", status: 404 },
];

let failed = false;
for (const check of checks) {
  try {
    const response = await fetch(new URL(check.path, origin), {
      redirect: "manual",
      signal: AbortSignal.timeout(10_000),
      headers: { Accept: "text/html" },
    });
    const destination = response.headers.get("location");
    const actualPath = destination
      ? new URL(destination, origin).pathname + new URL(destination, origin).search
      : null;
    const matches =
      response.status === check.status && (!check.location || actualPath === check.location);
    console.log(
      `${matches ? "PASS" : "FAIL"} ${check.path}: ${response.status}${actualPath ? ` → ${actualPath}` : ""}`,
    );
    if (!matches) failed = true;
  } catch (error) {
    console.error(
      `FAIL ${check.path}: ${error instanceof Error ? error.message : "request failed"}`,
    );
    failed = true;
  }
}

console.log(
  "These checks avoid the live Unsplash API. Verify gallery and authenticated save/remove manually.",
);
if (failed) process.exitCode = 1;
