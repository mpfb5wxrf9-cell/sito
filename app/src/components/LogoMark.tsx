export default function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center justify-center rounded-md bg-foreground ${className}`}>
      <svg viewBox="0 0 512 512" className="h-[62%] w-[62%]" aria-hidden="true">
        <path d="M256 132 L172 344 Q256 380 340 344 Z" fill="#fbf6ee" />
        <path d="M198 322 Q256 348 314 322" fill="none" stroke="#241c15" strokeWidth="12" strokeLinecap="round" />
        <circle cx="256" cy="204" r="17" fill="#241c15" />
        <circle cx="216" cy="258" r="14" fill="#241c15" />
        <circle cx="292" cy="264" r="14" fill="#241c15" />
      </svg>
    </span>
  )
}
