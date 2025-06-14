# 🎡 wheel-of-fortune-kop

A fully featured React Wheel of Fortune component with canvas rendering, audio effects, celebration animations, and advanced input options including CSV upload and dynamic CRUD list management.

---

## 🔥 Features

- 🎯 Pure React component using canvas
- 🎨 Customizable size, colors, fonts, and direction
- 📂 Import options from CSV or JSON
- ✍️ Add, edit, delete options dynamically
- 🔄 Smooth spin animation
- 🔊 Optional spin and cheer audio
- 🎉 Confetti celebration and winner popup

---

## 📦 Installation

```bash
npm install wheel-of-fortune-kop
```

---

Make sure to also install peer dependencies if not present:

```bash
npm install react react-dom
```

```bash
npm install papaparse
```

---

## 🛠️ Basic Usage

```tsx
import React from "react";
import Wheel from "wheel-of-fortune-kop";

const App = () => {
  const options = ["🍎 Apple", "🍌 Banana", "🍒 Cherry"];

  return (
    <Wheel
      options={options}
      font="Verdana"
      size={400}
      sliceColor="orange"
      textColor="#000"
      playSpinAudio={true}
      playCheerAudio={true}
      onSpinEnd={(selected) => alert(`Winner: ${selected}`)}
    />
  );
};
```

## 📁 CSV Import & Full CRUD Manager

You can also build a complete admin interface to manage the wheel options dynamically:

```tsx
import React, { useState } from "react";
import Papa from "papaparse";
import Wheel from "wheel-of-fortune-kop";
import "wheel-of-fortune-kop/style.css";
import Papa from "papaparse";

const WheelManager = () => {
  const [items, setItems] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [lastSelected, setLastSelected] = useState("");

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
    } catch {
      alert("Invalid JSON format");
    }
  };

  const handleDelete = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
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

      <input
        type="file"
        accept=".csv"
        onChange={handleCSVUpload}
        className="mb-2"
      />

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
```

## 📋 Props Reference

| Prop             | Type                             | Default       | Description                                             |
| ---------------- | -------------------------------- | ------------- | ------------------------------------------------------- |
| `options`        | `string[]` (required)            | —             | List of wheel options                                   |
| `direction`      | `"clockwise" \| "anticlockwise"` | `"clockwise"` | (future feature)                                        |
| `font`           | `string`                         | `"Arial"`     | Font used for option labels                             |
| `sliceColor`     | `string`                         | `"red"`       | Color of alternating slices                             |
| `textColor`      | `string`                         | `"#fff"`      | Text color                                              |
| `size`           | `number`                         | `300`         | Canvas size                                             |
| `onSpinEnd`      | `(selected: string) => void`     | —             | Called when spin ends                                   |
| `playSpinAudio`  | `boolean`                        | `false`       | Enable spinning sound                                   |
| `playCheerAudio` | `boolean`                        | `false`       | Enable cheer sound (make the cheer false there is bug ) |

## 🎯 Perfect For

- Classroom raffles
- Giveaways & contests
- Ice-breaker games
- Team-building exercises

## 📛 License

MIT © 2025 Krischal Om Pote

## Website demolink

https://demo-wheel-fortune-kop.vercel.app/
