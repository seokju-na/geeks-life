import { invoke } from '@tauri-apps/api/tauri';

export default function App() {
  const sendCommand = async () => {
    try {
      await invoke('execute_daily_life_command', {
        command: {
          name: 'DailyLifeCommand.UpdateScore',
          id: '2022-05-28',
          score: 'low',
        },
      });
    } catch (error: unknown) {
      console.error(error);
    }
  };

  return (
    <main>
      Hello World
      <button onClick={sendCommand}>send command</button>
    </main>
  );
}
