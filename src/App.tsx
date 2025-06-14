import "./App.css";
import Wheel from "./components/Wheel";

function App() {
  const options = ["Apple", "Banana", "Cherry"]; // sample data
  return (
    <>
      <>
        <Wheel
          options={options}
          font="Verdana"
          playSpinAudio={true}
          playCheerAudio={true}
          onSpinEnd={(selected) => console.log("Selected:", selected)}
        />
      </>
    </>
  );
}

export default App;
