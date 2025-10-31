import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthUserProvider } from "@/context/authProvider";
import icon from '../../public/icon.png'

// Load fonts with next/font and expose as CSS variables
import { Inter } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jbmono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

// Runs before React: sets data-theme from localStorage or system
const initThemeScript = `
(function () {
  try {
    var s = localStorage.getItem('theme');
    var prefers = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    var theme = s || prefers;
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch(_) {}
})();
`;

export const metadata = { title: "ClipNotes" };

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jbmono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Match browser UI to theme */}
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0B0F19" media="(prefers-color-scheme: dark)" />
        <script dangerouslySetInnerHTML={{ __html: initThemeScript }} />
      </head>
      <body>
        <AuthUserProvider>
        <ThemeProvider defaultTheme="dark">
          {children}
        </ThemeProvider>
        </AuthUserProvider>
        
      </body>
    </html>
  );
}
