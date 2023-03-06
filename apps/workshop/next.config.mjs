// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
        // Enables hot-reload and easy integration for local packages
        transpilePackages: ["@ecotoken/ui"],
    },
};

module.exports = nextConfig;
