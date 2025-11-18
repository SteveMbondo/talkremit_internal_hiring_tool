import './globals.css'
import React from 'react'
import Image from 'next/image'
import { X, Facebook, Instagram, Linkedin } from 'lucide-react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300','400','500','600','700'],
});

export const metadata = {
  title: 'TalkRemit Careers',
  description: 'Internal Careers Portal',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} flex flex-col min-h-screen`}>
        <div className="flex-1">
          {/* Header */}
          <header className="bg-white shadow-sm">
            {/* Hero Section */}
            <section className="relative bg-blue-600 text-white py-20 overflow-hidden">
              <div className="absolute inset-0 flex">
                <div className="h-full w-full bg-gradient-to-br from-[#4737a4] to-[#36f8fc]">
                </div>
                <div className="relative z-10 max-w-4xl mx-auto px-4">
                  <div className="mt-5 ml-6">
                    <Image 
                      src="https://prod-refactor-cms.talkremit.com/wp-content/uploads/2021/05/TR-logo-light.svg"
                      alt="TalkRemit Logo"
                      width={173}
                      height={28}
                    />
                  </div>
                </div>
                <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-6 px-4">
                  <h1 className="text-4xl md:text-5xl font-bold mt-2">
                    Join the TalkRemit Team
                  </h1>
                  <p className="text-lg md:text-xl max-w-2xl">
                    TalkRemit is a fully-licensed EMI (Electronic Money Institution) that enables people to send money to bank accounts, mobile wallets and cash pickup locations abroad.
                    Founded in 2016, our diverse team has used their experiences of migrant life and the issues with existing remittance services to build something that better serves migrant communities across the globe. Now we’re busy further improving our platform and creating additional financial products for the communities who most need them, to become a one-stop shop serving the needs of migrants around the world.
                    To Join us, Email your updated CV to : <strong>hr@talkRemit.com</strong>, with the position clearly indicated on the subject line.
                  </p>
                </div>
              </div>
            </section>
          </header>

          {/* Main content */}
          <main className="max-w-4xl mx-auto p-8">
            {children}
          </main>
        </div>

        {/* Footer */}
        <footer className="bg-white text-gray-800 mt-8 border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo */}
            <div className="mb-4 md:mb-0">
              <a href="/" aria-label="Logo">
                <Image
                  src="https://prod-refactor-cms.talkremit.com/wp-content/uploads/2021/05/TR-logo-dark.svg"
                  alt="TalkRemit Dark Logo"
                  width={173}
                  height={28}
                />
              </a>
            </div>

            {/* Company */}
            <div>
              <h2 className="font-bold mb-2">Company</h2>
              <ul>
                <li>
                  <a href="https://www.talkremit.com/about/" className="hover:underline">
                    About Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Our Communities */}
            <div>
              <h2 className="font-bold mb-2">Our Communities</h2>
              <ul className="flex gap-4">
                <li>
                  <a href="https://x.com/talkremit" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500 transition-colors">
                    <X className="h-6 w-6" />
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/talkremit/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">
                    <Facebook className="h-6 w-6" />
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/talkremit/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-500 transition-colors">
                    <Instagram className="h-6 w-6" />
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/company/talkremit" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-700 transition-colors">
                    <Linkedin className="h-6 w-6" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center text-gray-400 text-sm pb-4">
            &copy; 2025 Steve Mbondo. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  )
}
