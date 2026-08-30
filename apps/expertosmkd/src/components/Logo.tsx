import { Jura } from 'next/font/google'
import Link from 'next/link'

const jura = Jura({ subsets: ['latin'], weight: ['300', '400', '500', '600'] })

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center select-none cursor-pointer ${jura.className} ${className}`}>
      <span className="text-[#5EA4FF] font-light mr-1 text-[1.1em]">&lt;/&gt;</span>
      <span className="text-[#A87FFB] font-light tracking-[0.1em]">EXPERTOS</span>
      <span className="text-[#5EA4FF] font-bold tracking-[0.1em]">MKD</span>
    </Link>
  )
}
