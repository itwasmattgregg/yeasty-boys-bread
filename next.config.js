module.exports = {
  swcMinify: true,
  experimental: {
    scrollRestoration: true,
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [
            {
              type: "host",
              value: "popup.yeastyboysbread.com",
            },
          ],
          destination: "/",
        },
      ],
    };
  },
};
