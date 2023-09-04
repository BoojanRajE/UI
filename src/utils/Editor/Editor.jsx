import { useState } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

const Editor = ({ onChange, setContents }) => {
  // const handleImageUploadBefore = async (files, info, uploadHandler) => {
  //   // uploadHandler is a function
  //   //
  //   const KEY = 'docs_upload_example_us_preset'
  //   const Data = new FormData()
  //   Data.append('file', files[0])
  //   Data.append('upload_preset', KEY)
  //   await axios({
  //     method: 'POST',
  //     url: 'https://api.cloudinary.com/v1_1/demo/image/upload',
  //     data: Data
  //   })
  //     .then((response) => {
  //       //
  //       const res = {
  //         // The response must have a "result" array.
  //         errorMessage: response?.data?.message,
  //         result: [
  //           {
  //             url: response.data.secure_url,
  //             size: response.data.file_size,
  //             name: response.data.public_id
  //           }
  //         ]
  //       }
  //       uploadHandler(res)
  //     })
  //     .catch((error) => {
  //
  //     })
  // }
  const handleImageUpload = (
    targetElement,
    index,
    state,
    info,
    remainingFilesCount,
    core
  ) => {};
  const handleImageUploadError = (errorMessage, result) => {};

  const htmlWithTable2 = `<html><p>data is not loading</p></html>`;
  const [value, setValue] = useState(htmlWithTable2);

  const handleEditorChange = (content) => {};
  return (
    <SunEditor
      // setContents="My contents"
      autoFocus={false}
      showToolbar={true}
      onChange={handleEditorChange}
      setDefaultStyle="height: auto"
      setOptions={{
        mode: 'inline',
        buttonList: [
          [
            'bold',
            'underline',
            'italic',
            'strike',
            'list',
            'align',
            'fontSize',
            'formatBlock',
            'table',
            'image',
          ],
        ],
      }}
    />
  );
};
export default Editor;
