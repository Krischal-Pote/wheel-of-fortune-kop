import React, { useState } from "react";
import Papa from "papaparse";
import Wheel from "./Wheel";

const WheelManager: React.FC = () => {
  const [items, setItems] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [lastSelected, setLastSelected] = useState<string>("");

  // CSV Upload Handler
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results: Papa.ParseResult<string[]>) => {
        const values = results.data.flat().filter(Boolean);
        setItems(values);
      },
    });
  };

  // JSON Manual Input Handler
  const handleJSONChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleJSONSubmit = () => {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed) && parsed.every((v) => typeof v === "string")) {
        setItems(parsed);
      } else {
        alert("JSON should be an array of strings");
      }
    } catch (err) {
      alert("Invalid JSON format");
    }
  };

  const handleDelete = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleEdit = (index: number, newVal: string) => {
    const updated = [...items];
    updated[index] = newVal;
    setItems(updated);
  };

  const handleAdd = () => {
    setItems([...items, ""]);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Wheel of Fortune Manager</h2>

      {/* Upload CSV */}
      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleCSVUpload}
        className="mb-2 border-amber-50"
      />

      {/* JSON Input */}
      <textarea
        placeholder='Enter JSON like ["Apple", "Banana"]'
        value={input}
        onChange={handleJSONChange}
        className="w-full border p-2 mt-2"
        rows={4}
      />
      <button
        onClick={handleJSONSubmit}
        className="bg-blue-500 text-white px-3 py-1 mt-2 rounded hover:bg-blue-600"
      >
        Load JSON
      </button>

      {/* CRUD List */}
      <div className="mt-4">
        <h3 className="font-semibold mb-1">Manage Options</h3>
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleEdit(index, e.target.value)}
              className="border p-1 flex-grow"
            />
            <button
              onClick={() => handleDelete(index)}
              className="bg-red-500 text-white px-2 rounded"
            >
              Delete
            </button>
          </div>
        ))}
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-3 py-1 mt-2 rounded"
        >
          Add Option
        </button>
      </div>

      {/* Wheel Preview */}
      <div className="mt-6">
        <Wheel
          options={items}
          font="Verdana"
          onSpinEnd={(selected) => {
            setLastSelected(selected);
            console.log("Selected:", selected);
          }}
          playSpinAudio={true}
          playCheerAudio={true}
        />
      </div>
      <div className="hidden">{lastSelected}</div>
    </div>
  );
};

export default WheelManager;
