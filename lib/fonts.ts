import { Instrument_Sans, Fraunces, Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  style: ["italic", "normal"],
});

const instrument = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces-mono",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export { inter, instrument, fraunces };
