import {useEffect, useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import Editor from "../Editor";
import axios from "axios";

export default function EditPost() {
  const {id} = useParams();
  const [title,setTitle] = useState('');
  const [summary,setSummary] = useState('');
  const [content,setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect,setRedirect] = useState(false);
  const url = process.env.REACT_APP_URL

  useEffect(() => {
    fetch(`${url}/post/`+id)
      .then(response => {
        response.json().then(postInfo => {
          setTitle(postInfo.title);
          setContent(postInfo.content);
          setSummary(postInfo.summary);
          setFiles(postInfo.files);
        });
      });
  }, []);

  async function updatePost(ev) {
    ev.preventDefault();

    const _data = new FormData();
    _data.append("file", files[0]);
    _data.append("upload_preset", "blogit3");

    try {
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dmvodpbfi/image/upload",
        _data
      );

      console.log(uploadRes.data.url)

      const res = await axios.put(`${url}/post`, {
        title,
        summary,
        content,
        file: uploadRes.data.url,
        id
      } ,{
        withCredentials: true
      });

      if (res.status === 204) {
        setRedirect(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    // const data = new FormData();
    // data.set('title', title);
    // data.set('summary', summary);
    // data.set('content', content);
    // data.set('id', id);
    // if (files?.[0]) {
    //   data.set('file', files?.[0]);
    // }
    // const response = await fetch(`${url}/post`, {
    //   method: 'PUT',
    //   body: data,
    //   credentials: 'include',
    // });
    // if (response.ok) {
    //   setRedirect(true);
    // }
  }

  if (redirect) {
    return <Navigate to={'/post/'+id} />
  }

  return (
    <form onSubmit={updatePost}>
      <input type="title"
             placeholder={'Title'}
             value={title}
             onChange={ev => setTitle(ev.target.value)} />
      <input type="summary"
             placeholder={'Summary'}
             value={summary}
             onChange={ev => setSummary(ev.target.value)} />
      <input type="file"
             onChange={ev => setFiles(ev.target.files)} />
      <Editor onChange={setContent} value={content} />
      <button style={{marginTop:'5px'}}>Update post</button>
    </form>
  );
}