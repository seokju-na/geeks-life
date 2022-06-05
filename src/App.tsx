import { ToggleGroup, ToggleGroupItem } from './components/ToggleGroup';

export default function App() {
  return (
    <main>
      <div style={{ padding: 24 }}>
        <ToggleGroup type="single">
          <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
          <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div style={{ padding: 24 }}>
        <button>test</button>
      </div>
    </main>
  );
}
