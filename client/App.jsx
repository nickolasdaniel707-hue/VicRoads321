import { useState } from "react";

export default function App() {
  const [profile, setProfile] = useState("");
  const [license, setLicense] = useState("");
  const [id, setId] = useState("");

  const upload = async (file, setImage) => {
    con
    const fd = new FormData();
    fd.append("image", file);

    const res = await fetch("/upload", {
      method: "POST",
      body: fd,
    });

    const data = await res.json();
    setImage(data.url);
  };

  const save = async () => {
    await fetch("/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profilePhoto: profile,
        licensePhoto: license,
        idPhoto: id,
      }),
    });

    alert("Saved!");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>VicRoads Upload</h1>

      <h3>Profile Photo</h3>
      <input type="file" onChange={(e) => upload(e.target.files[0], setProfile)} />
      {profile && <img src={profile} width="150" />}

      <h3>License Photo</h3>
      <input type="file" onChange={(e) => upload(e.target.files[0], setLicense)} />
      {license && <img src={license} width="150" />}

      <h3>ID Photo</h3>
      <input type="file" onChange={(e) => upload(e.target.files[0], setId)} />
      {id && <img src={id} width="150" />}

      <br /><br />
      <button onClick={save}>Submit</button>
    </div>
  );
}
