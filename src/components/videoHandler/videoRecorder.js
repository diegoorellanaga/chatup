import {React, useState, useEffect} from 'react'
import { Button } from 'react-bootstrap';

function startRecord() {

    document.getElementById("start_record_button").disabled = true;
    document.getElementById("stop_record_button").disabled = false;
    document.getElementById("save_record_button").disabled = true;
    document.getElementById("play_record_button").disabled = true;

}

function stopRecord() {

    document.getElementById("start_record_button").disabled = false;
    document.getElementById("stop_record_button").disabled = true;
    document.getElementById("save_record_button").disabled = false;
    document.getElementById("play_record_button").disabled = false;

}
const VideoRecorder = ({sourceActivated}) => {

 
var mediaRecorder; 

//var isRecording = false
var isStoped = false
var recordedChunks = [];
 function record(canvas, time) {
 // var recordedChunks = [];
  return new Promise(async  function (res, rej) {
      var stream = canvas.captureStream(window.canvasFPS /*fps*/);

//this work for video file
      var video = document.getElementById("video")

      var out = document.getElementById("out")


const captureStream = out.captureStream();

var mixedStream = new MediaStream([...stream.getTracks(), ...captureStream.getTracks()]); 

      mediaRecorder = new MediaRecorder(mixedStream, {
          mimeType: "video/webm; codecs=vp9"
      });
      
      //ondataavailable will fire in interval of `time || 4000 ms` //it will end after time or 4000 miliseconds
      mediaRecorder.start(time); //time || 4000
      console.log("STARTING recording")

      mediaRecorder.ondataavailable = function (event) {
          recordedChunks.push(event.data);
          console.log("STARTING ondataavailable")
           // after stop `dataavilable` event run one more time
          if (mediaRecorder.state === 'recording' && isStoped) {
            console.log("STOPPED ondataavailable")
              mediaRecorder.stop();
              stopRecord()
          }

      }

      mediaRecorder.onstop = function (event) {

        console.log("STOPPED recording")
          var blob = new Blob(recordedChunks, {type: "video/webm" });
          var url = URL.createObjectURL(blob);
          recordedChunks = []
          isStoped = false
       //   setIsRecording(false)


       //const filename = window.prompt('Enter file name');
       const filename = 'recording'
       var downloadLink = document.getElementById("download")
       downloadLink.href = url

       downloadLink.download = `${filename || 'recording'}.webm`;

       var video$ = document.getElementById('video_record')
     //  document.body.appendChild(video$)
       video$.setAttribute('src', url)


          res(url);
      }
  })
}

var recording;

const startRecording = ()=>{
    document.getElementById("video_record").hidden = true;
var canvas = document.getElementById("canvasOutput")
//record(canvas, 10000)
recording = record(canvas, 200)
startRecord()
}

const downloadRecord = ()=>{
// download it   if I press download without stoping it will download after the recording ends, it it ends...
var link$ = document.createElement('a')
link$.setAttribute('download','recordingVideo') 
recording.then(url => {
link$.setAttribute('href', url) 
link$.click()
})

}
const stopRecording = ()=>{

    //if(!isStoped && mediaRecorder.state === 'recording'){
        if(!isStoped ){
isStoped = true
    }    
//mediaRecorder.stop()

}

console.log("STOPED VIDEO RECORDING!!!!")
const playRecordedVideo = ()=>{
var video$ = document.getElementById('video_record')
document.body.appendChild(video$)
recording.then(url => video$.setAttribute('src', url) )

}

const showPlayRecordingVideo = ()=> {
    var video$ = document.getElementById('video_record')
    video$.hidden = false
}


useEffect(()=>{

    if(sourceActivated){
    document.getElementById("start_record_button").disabled = false;
    }else{
        document.getElementById("start_record_button").disabled = true; 
    }
    document.getElementById("stop_record_button").disabled = true;
    document.getElementById("save_record_button").disabled = true;
    document.getElementById("play_record_button").disabled = true;

},[])

    return (
<>
  <Button id="start_record_button" variant="dark" className="m-1" block onClick={startRecording}>Record</Button>
  <Button id="stop_record_button" variant="dark" className="m-1" block onClick={stopRecording}>Stop Record</Button>
  <span><a id="download" ><Button id="save_record_button" variant="dark" className="m-1" block >Save Recording</Button></a></span>
  <Button id="play_record_button" variant="dark" className="m-1" block onClick={showPlayRecordingVideo}>play Recording</Button>
</>
    )
}

export default VideoRecorder


//     function createRecorder (stream, mimeType) {   onClick={downloadRecord}
//       // the stream data is stored in this array
//       let recordedChunks = []; 
    
//       const mediaRecorder = new MediaRecorder(stream);
    
//       mediaRecorder.ondataavailable = function (e) {
//         if (e.data.size > 0) {
//           recordedChunks.push(e.data);
//         }  
//       };
//       mediaRecorder.onstop = function () {
//          saveFile(recordedChunks);
//          recordedChunks = [];
//       };
//       mediaRecorder.start(200); // For every 200ms the stream data will be stored in a separate chunk.
//       return mediaRecorder;
//     }

//     function saveFile(recordedChunks){

//       const blob = new Blob(recordedChunks, {
//          type: 'video/webm'
//        });
//        let filename = window.prompt('Enter file name'),
//            downloadLink = document.createElement('a');
//        downloadLink.href = URL.createObjectURL(blob);
//        downloadLink.download = `＄{filename}.webm`;
   
//        document.body.appendChild(downloadLink);
//        downloadLink.click();
//        URL.revokeObjectURL(blob); // clear from memory
//        document.body.removeChild(downloadLink);
//    }

//    async function recordScreen() {
//     return await navigator.mediaDevices.getDisplayMedia({
//         audio: true, 
//         video: { mediaSource: "screen"}
//     });
// }
// let mediaRecorder;
//    const startRecording = ()=> {

//     let stream = await recordScreen();
//     let mimeType = 'video/webm';
//      mediaRecorder = createRecorder(stream, mimeType);
//     // After some time stop the recording by 
//     mediaRecorder.stop(); // this will ask for file name and save video

//    }

//    const stopRecording = ()=>{
//     mediaRecorder.stop(); 
//    }
    
//     navigator.mediaDevices.getUserMedia({audio:true,video:true})
//     .then(stream => {
//         window.localStream = stream;
//     })
//     .catch( (err) =>{
//         console.log(err);
//     });
// // later you can do below
// // stop both video and audio
// localStream.getTracks().forEach( (track) => {
// track.stop();
// });
// // stop only audio
// localStream.getAudioTracks()[0].stop();
// // stop only video
// localStream.getVideoTracks()[0].stop();