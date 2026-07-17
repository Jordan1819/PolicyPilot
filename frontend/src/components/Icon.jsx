export function Icon({ name, size = 20 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const paths = {
    spark: <><path d="m12 2-1.7 6.3L4 10l6.3 1.7L12 18l1.7-6.3L20 10l-6.3-1.7L12 2Z" /><path d="m19 16-.7 2.3L16 19l2.3.7L19 22l.7-2.3L22 19l-2.3-.7L19 16Z" /></>,
    document: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    search: <><circle cx="11" cy="11" r="6" /><path d="m20 20-4.2-4.2" /></>,
    source: <><path d="M9 12 4 17l3 3 5-5M15 12l5-5-3-3-5 5" /><path d="m14 7 3 3M7 14l3 3" /></>,
  }
  return <svg {...common}>{paths[name]}</svg>
}
