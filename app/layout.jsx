import "./globals.css";

export const metadata = {
  title: "Hanout Direct",
  description: "B2B FMCG ordering pilot"
};

export default function RootLayout({ children }) {
  return <html><body>{children}</body></html>;
}