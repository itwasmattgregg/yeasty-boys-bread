module.exports = {
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
          destination: "/popup",
        },
      ],
    };
  },
};
