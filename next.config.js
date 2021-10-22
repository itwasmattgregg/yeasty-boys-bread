module.exports = {
  asyncrewrites() {
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
