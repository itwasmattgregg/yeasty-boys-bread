const nextConfig = {
  rewrites() {
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

module.exports = nextConfig;
