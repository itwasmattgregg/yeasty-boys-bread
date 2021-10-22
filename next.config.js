module.exports = {
  async rewrites() {
    return [
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "popup.yeastyboysbread.com",
          },
        ],
        destination: "/popup",
      },
    ];
  },
};
