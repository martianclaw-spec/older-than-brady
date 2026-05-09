/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ui-avatars.com" }
    ]
  },
  async redirects() {
    return [
      // Inverse-phrasing aliases — point at the canonical /older-than-brady/<slug>.
      // Ensures any external link or guess at the URL still lands on the right page.
      {
        source: "/younger-than-brady/:slug*",
        destination: "/older-than-brady/:slug*",
        permanent: true
      },
      {
        source: "/who-is-younger-than-tom-brady",
        destination: "/who-is-older-than-tom-brady",
        permanent: true
      }
    ];
  }
};

module.exports = nextConfig;
