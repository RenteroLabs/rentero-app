/** @type {import('next').NextConfig} */

const webpack = require('webpack')

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
  webpack: (config, { webpack }) => {
    config.plugins.push(new webpack.IgnorePlugin(/^electron$/))
    return config
  },
}

module.exports = nextConfig
