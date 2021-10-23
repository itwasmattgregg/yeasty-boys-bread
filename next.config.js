module.exports = {
  async rewrites() {
    return {
      afterFiles: [
        {
          source: "/:path*",
          has: [
            {
              type: "host",
              value: "popup.yeastyboysbread.com",
            },
          ],
          destination: "/popup/:path*",
        },
      ],
    };
  },
};
