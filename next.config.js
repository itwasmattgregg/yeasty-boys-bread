module.exports = {
  async rewrites() {
    return [
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
    ];
  },
};
