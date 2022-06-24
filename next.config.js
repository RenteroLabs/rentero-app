/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['tva1.sinaimg.cn'],
    loader: 'akamai',
    path: '',
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^electron$/,
    }),
  ],
}

module.exports = nextConfig
