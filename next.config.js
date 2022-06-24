/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['tva1.sinaimg.cn'],
    loader: 'akamai',
    path: '',
  },
}

module.exports = nextConfig
