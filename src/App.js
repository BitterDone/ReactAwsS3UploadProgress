import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import AWS from 'aws-sdk';

function App() {
  const [selectedFiles, setSelectedFiles] = useState({})
  const [uploadProg, setUploadProg] = useState([0,0,0,0,0])
  
  var s3 = new AWS.S3({
    apiVersion: '2012-10-17',
    accessKeyId: 'accessKeyId',
    secretAccessKey: 'secretAccessKey',
  });

   const handleFile = event => {
     console.log(event?.target?.files)
      setSelectedFiles(event?.target?.files)
   }

   const upload = event => {
     Object.keys(selectedFiles).forEach((key, index) => { // selectedFiles
      console.log(key)
      console.log(selectedFiles[key])
      var params = {
        Body: selectedFiles[key], 
        Bucket: "uploadprogress", 
        Key: `exampleobject${index}`, 
        Metadata: {
         "metadata1": "value1", 
         "metadata2": "value2"
          }
       };

       s3.putObject(params)
        .on('httpUploadProgress', (progressEvent, response) => {
          const newUploadProg = [...uploadProg]
          const percent = parseInt(progressEvent.loaded / progressEvent.total)
          newUploadProg[index] = percent
          console.log(percent)
          setUploadProg(newUploadProg)
        })
        .send(s)
    })  
   }

   const s = (err, data) => {
    if (err) console.log(err, err.stack);
    else     console.log(data);
   }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <input type="file" name="file" onChange={handleFile} multiple/>
        <button type="button" class="btn btn-success btn-block" onClick={upload}>Upload</button> 
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
