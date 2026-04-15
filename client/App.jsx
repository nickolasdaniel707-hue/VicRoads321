import { useState } from "react";

export default function App() {
  const [img, setImg] = useState("");

  const upload = async (file) => {
    const fd = new FormData();
    fd.append("image", file);

    const res = await fetch("/upload", {
      method: "POST",
      body: fd
    });

    const data = await res.json();
    setImg(data.url);
  };

  return (
    <div style={{padding:20}}>
      <h1>Upload Image</h1>
      <input type="file" onChange={e => upload(e.target.files[0])} />
      {img && <img src={img} width="200" />}
    </div>
  );
}
