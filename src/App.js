import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import AWS from 'aws-sdk';
import { accessKeyId, secretAccessKey } from './secrets'

function App() {
  const [selectedFiles, setSelectedFiles] = useState({})
  const [uploadProg, setUploadProg] = useState([])
  
  var s3 = new AWS.S3({
    apiVersion: '2012-10-17',
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  });

   const handleFile = event => {
      setSelectedFiles(event?.target?.files)
      setUploadProg(new Array(Object.keys(event?.target?.files).length).fill(0))
   }
   
   /*
   https://stackoverflow.com/questions/61004673/the-callback-in-s3-putobject-onhttpuploadprogress-callback-doesnt-update
   https://www.reddit.com/r/reactjs/comments/fu87ap/the_callback_in_s3putobjectonhttpuploadprogress/

   const [arr, setArr] = useState([0, 0]);
   const fn = () => {
     setArr(arr => {
       arr[0] = 1;
       return arr;
     });
   }
   */

   const upload = event => {
     Object.keys(selectedFiles).forEach((key, index) => {
      console.log(key)
      console.log(selectedFiles[key])
      var params = {
        Body: selectedFiles[key], 
        Bucket: "uploadprogress", 
        Key: `exampleobject-_${index}`, 
       };

       s3.putObject(params)
        .on('httpUploadProgress', (progressEvent, response) => {
          
          setUploadProg(uploadProg =>{
            const newUploadProg = [...uploadProg]
            const percent = parseInt(100*progressEvent.loaded / progressEvent.total)
            newUploadProg[index] = percent
            console.log(uploadProg)
            console.log(newUploadProg)
            console.log('______________')
            return newUploadProg
          })
        })
        .send((err, data) => {
          if (err) console.log(err, err.stack);
          else     console.log(data);
         })
    })  
   }


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <input type="file" name="file" onChange={handleFile} multiple/>
        <button type="button" className="btn btn-success btn-block" onClick={upload}>Upload</button>
        {uploadProg.map((percent, idx) => (<div key={idx} style={{
          margin: 5,
          width: 100,
          height: 10,
          backgroundColor: 'yellow'
        }}>
          <div style={{
            height: 8,
            width: percent,
            backgroundColor: 'green' ,
          }}>
          </div>
        </div>))}
      </header>
    </div>
  );
}

export default App;
