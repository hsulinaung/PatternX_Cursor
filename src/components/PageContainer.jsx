export default function PageContainer({ children, className = "" }) {
  return <main className={`page ${className}`.trim()}>{children}</main>;
}
