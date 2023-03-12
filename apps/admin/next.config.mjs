// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: true,
    swcMinify: true,
    transpilePackages: [
        "@ecotoken/api",
        "@ecotoken/db",
        "@ecotoken/auth",
        "@ecotoken/ui",
    ],
    // We already do linting on GH actions
    eslint: {
        ignoreDuringBuilds: !!process.env.CI,
    },
    domains: [
        process.env.NEXT_PUBLIC_CDN_URL?.replaceAll("https://", "") ?? "",
        "eco-token.io",
    ],
};

export default config;
