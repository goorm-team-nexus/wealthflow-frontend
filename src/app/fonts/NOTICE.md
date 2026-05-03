# Font Notice

This directory contains local font files used by the application build so `next/font/google`
is not required at build time.

## Geist

- Files:
  - `Geist-Variable.woff2`
  - `GeistMono-Variable.woff2`
- Source: `vercel/geist-font`
- Source URLs:
  - `https://raw.githubusercontent.com/vercel/geist-font/main/packages/next/dist/fonts/geist-sans/Geist-Variable.woff2`
  - `https://raw.githubusercontent.com/vercel/geist-font/main/packages/next/dist/fonts/geist-mono/GeistMono-Variable.woff2`
- License: SIL Open Font License 1.1
- License file: `LICENSE-Geist.txt`

## Noto Sans KR Fallback

- File: `NotoSansKR-Variable.woff2`
- Source: `notofonts/noto-cjk`
- Source URL: `https://raw.githubusercontent.com/notofonts/noto-cjk/main/android/NotoSansCJK-wght-400-900.ttf.woff2`
- Usage note: this official Noto CJK WOFF2 distribution includes Korean glyph coverage and is
  exposed through the local CSS variable `--font-noto-sans-kr` for the app's Korean fallback.
- License: SIL Open Font License 1.1
- License file: `LICENSE-NotoSansKR.txt`
