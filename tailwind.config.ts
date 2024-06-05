import casarTheme from '@casar/ui-kit/tailwind-config'
import type { Config } from 'tailwindcss'

const config: Config = {
  presets: [casarTheme],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@casar/ui-kit/dist/**/*.js',
  ],
  theme: {},
  plugins: [],
}
export default config
