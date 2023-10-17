import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Editor from "../Editor";
import axios from "axios";
import { UserContext } from "../UserContext";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useContext(UserContext)

  async function createNewPost(ev) {
    ev.preventDefault();
    

    // console.log("here",files);

    if(!title)
    {
      return alert("Please type a title!!");
    }

    if(!files)
    {
      return alert("Please select a file!!");
    }

    const _data = new FormData();
    _data.append("file", files[0]);
    _data.append("upload_preset", "blogit3");

    try {
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dmvodpbfi/image/upload",
        _data
      );

      console.log(uploadRes.data.url)

      const res = await axios.post(`/api/post`, {
        title,
        summary,
        content,
        files: uploadRes.data.url,
      } ,{
        withCredentials: true
      });

      if (res.status === 201) {
        setRedirect(true);
      }
    } catch (error) {
      console.error("Error:", error);
      console.log("here")

      alert("Please login again!!")
      setUserInfo(null)
      navigate('/')
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <form onSubmit={createNewPost}>
      <input
        type="title"
        placeholder={"Title"}
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <input
        type="summary"
        placeholder={"Summary"}
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
      />
      <input type="file" onChange={(ev) => setFiles(ev.target.files)} />
      <Editor value={content} onChange={setContent} />
      <button style={{ marginTop: "5px" }}>Create post</button>
    </form>
  );
}
