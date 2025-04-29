// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Profile() {
  const [profile, setProfile] = useState({
    profileImage: "",
    linkedin: "",
    instagram: "",
    twitter: "",
    gmail: "",
  });
  const [preview, setPreview] = useState("");
  const [credits, setCredits] = useState(0);

  const token = localStorage.getItem("token");

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile(res.data.profile);
      setCredits(res.data.credits);
      if (res.data.dailyLoginRewarded) {
        toast.success("🎉 You earned 5 credits for logging in today!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      const file = files[0];
      setPreview(URL.createObjectURL(file));
      setProfile((prev) => ({ ...prev, [name]: file }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (field) => {
    const formData = new FormData();
    formData.append("field", field);
    formData.append("value", profile[field]);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/update-profile-field",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(`${field} updated. Current credits: ${res.data.credits}`);
      setCredits(res.data.credits);
    } catch (err) {
      toast.error(`Failed to update ${field}`);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded-lg mt-10">
      <h2 className="text-2xl mb-4 font-bold">Your Profile</h2>
      <p className="mb-4">Credits: <strong>{credits}</strong></p>

      {/* Profile Image Upload */}
      <div className="mb-4">
        <label className="block font-semibold">Profile Image</label>
        <input type="file" name="profileImage" onChange={handleChange} />
        {preview && <img src={preview} alt="Preview" className="mt-2 w-24 h-24 rounded-full" />}
        <button onClick={() => handleSave("profileImage")} className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">Save</button>
      </div>

      {/* Other fields */}
      {["linkedin", "instagram", "twitter", "gmail"].map((field) => (
        <div key={field} className="mb-4">
          <label className="block font-semibold capitalize">{field}</label>
          <input
            type="text"
            name={field}
            value={profile[field]}
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <button
            onClick={() => handleSave(field)}
            className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      ))}
    </div>
  );
}

export default Profile;
