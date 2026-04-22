import PinCard from './PinCard'

export default function MasonryGrid({ items, mood }) {
  // Split into 3 columns
  const cols = [[], [], []]
  items.forEach((item, i) => cols[i % 3].push(item))

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16,
        padding: '0 24px 60px',
        maxWidth: 1100,
        margin: '0 auto',
      }}
    >
      {cols.map((col, ci) => (
        <div key={ci} style={{ display: 'flex', flexDirection: 'column' }}>
          {col.map((item) => (
            <PinCard key={item.id} item={item} mood={mood} index={item.origIndex} />
          ))}
        </div>
      ))}
    </div>
  )
}
