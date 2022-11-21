import {React, useState} from 'react'
import { Button } from 'react-bootstrap';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
var cv = require('opencv.js');



function stopBothVideoAndAudio(stream) {
    stream.getTracks().forEach(function(track) {
        if (track.readyState == 'live') {
            track.stop();
        }
    });
}

const VideoSource = ({
    setSourceActivated,
    inputVideoId,
    outputCanvasVideoId,
    isVideoStopped,
    handleModalShow,
    setIsVideoStopped,
    setIsVideoFromCamera,
    isVideoFromCamera,
    setIsVideoFromFile,
    isVideoFromFile
}) => {

    var mediaRecorder;
    var audioStream;
    var ctx;
    var videoStream;
    var totalStream;
    var sourceForAudio;
    const [audioSourceConnected, setAudioSourceConnected] = useState(false)
    const captureVideo = async () => {

        var old_element = document.getElementById(inputVideoId);
        var video = old_element.cloneNode(true);
        old_element.parentNode.replaceChild(video, old_element);


        setInterval(() => {

            console.log(video.currentTime > 0 && !video.paused && !video.ended &&
                video.readyState > video.HAVE_CURRENT_DATA)
        }, [1000])

        document.getElementById("start_record_button").disabled = false;
        setSourceActivated(true)
        if (isVideoFromFile) {

            setIsVideoStopped(false)

        } else {

            setIsVideoStopped(false)
            video.onplay = function() {

                var intervalPlay = setInterval(() => {

                    if (video.videoHeight > 0) {
                        // video.height = video.videoHeight
                        // video.width = video.videoWidth

                        video.height = parseInt(window.customVideowidth * video.videoHeight / video.videoWidth)
                        video.width = window.customVideowidth

                        console.log(video.width, video.height, "Interval Cleared")
                        const canvas = document.getElementById(outputCanvasVideoId)
                        // const vid = document.getElementById("localVideo");
                        const vidStyleData = video.getBoundingClientRect();
                        canvas.style.width = vidStyleData.width + "px";
                        canvas.style.height = vidStyleData.height + "px";
                        canvas.style.left = vidStyleData.left + "px";
                        canvas.style.top = vidStyleData.top + "px";

                        clearInterval(intervalPlay)
                       // window.streaming = true
                        console.log("video not from file")
                        //We copy from the video html element to canvas
                        let src_v = new cv.Mat(video.height, video.width, cv.CV_8UC4);
                        let dst_v = new cv.Mat(video.height, video.width, cv.CV_8UC1);
                        let cap = new cv.VideoCapture(video);

                        const FPS = window.FPS;
                        window.streaming = false

                        function processVideo() {
                            try {
                                if (!window.streaming) {
                                    // clean and stop.
                                    src_v.delete();
                                    dst_v.delete();
                                    console.log("Canny Edge Stopped")
                                    // delete cap;
                                    window.activeEffect = false
                                    return;
                                }
                                let begin = Date.now();
                                // start processing.
                                cap.read(src_v);
                                cv.imshow(outputCanvasVideoId, src_v);
                                //   cv.imshow('canvasFrame', src);
                                // schedule the next one.
                                let delay = 1000 / FPS - (Date.now() - begin);
                                // console.log("not stoping",delay,window.streaming)
                                setTimeout(processVideo, delay);
                            } catch (err) {
                                //utils.printError(err);
                                console.log(err)
                            }
                        };

                        var waitEffectInterval = setInterval(() => {
                            console.log("canny", window.activeEffect, window.streaming)
                            if (!window.activeEffect) {
                                window.activeEffect = true
                                window.streaming = true

                                setTimeout(processVideo, 100);
                                clearInterval(waitEffectInterval)
                            }

                        }, 10);
                        //We copy from the video html element to canvas END///////////
                    }
                    console.log("Interval Not Cleared")
                }, [10])
            };

            video.onpause = function() {

                window.streaming = false

                stopBothVideoAndAudio(totalStream)

                setIsVideoStopped(true)
            };

            if (isVideoFromCamera) {
                //  setSourceActivated(true)
                navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: true
                    })
                    .then(function(stream) {
                        totalStream =  new MediaStream(stream.getVideoTracks());
                        video.srcObject = totalStream;
                        video.play();
                        document.getElementById("start_source_button").disabled = false;
                        var out = document.getElementById("out")

                        audioStream = new MediaStream(stream.getAudioTracks());
                        out.srcObject = audioStream
                        out.play()

                        out.onpause = function() {
                            stream.getTracks().forEach(function(track) {
                                track.stop();
                            });
                     //       out.srcObject.getVideoTracks()[0].stop();
                        }
                    })
                    .catch(function(err) {
                        console.log("An error occurred! " + err);
                        alert(err)
                    });

            } else {
                //  setSourceActivated(true)
                navigator.mediaDevices.getDisplayMedia({
                        video: {
                            cursor: "motion"
                        },
                        audio: {
                            'echoCancellation': true
                        }
                    })
                    .then(function(stream) {

                        totalStream = stream
                        videoStream = new MediaStream(stream.getVideoTracks());
                        video.srcObject = videoStream //stream //videoStream
                        video.play();

                        document.getElementById("start_source_button").disabled = false;
                        var out = document.getElementById("out")
                        out.muted = true;
                        out.onpause = function() {

                            stream.getTracks().forEach(function(track) {
                                track.stop();
                            });
                        }
                        audioStream = new MediaStream(stream.getAudioTracks());
                        out.srcObject = audioStream
                        out.play()
                    })
                    .catch(function(err) {
                        console.log("An error occurred! " + err);
                        alert(err)
                    });
            }
        }
    }

    const deleteEffectsVideo = () => {
        let video = document.getElementById(inputVideoId);
        let src_v = new cv.Mat(video.height, video.width, cv.CV_8UC4);
        let dst_v = new cv.Mat(video.height, video.width, cv.CV_8UC1);
        let cap = new cv.VideoCapture(video);

        const FPS = window.FPS;
        window.streaming = false

        function processVideo() {
            try {
                if (!window.streaming) {
                    // clean and stop.
                    src_v.delete();
                    dst_v.delete();
                    console.log("Canny Edge Stopped")
                    // delete cap;
                    window.activeEffect = false
                    return;
                }
                let begin = Date.now();
                // start processing.
                cap.read(src_v);
                cv.imshow(outputCanvasVideoId, src_v);
                //   cv.imshow('canvasFrame', src);
                // schedule the next one.
                let delay = 1000 / FPS - (Date.now() - begin);
                // console.log("not stoping",delay,window.streaming)
                setTimeout(processVideo, delay);
            } catch (err) {
                //utils.printError(err);
                console.log(err)
            }
        };

        var waitEffectInterval = setInterval(() => {
            console.log("canny", window.activeEffect, window.streaming)
            if (!window.activeEffect) {
                window.activeEffect = true
                window.streaming = true

                setTimeout(processVideo, 100);
                clearInterval(waitEffectInterval)
            }

        }, 10);

    }

    const changeToScreen = () => {
        window.streaming = false
        var videoElement = document.getElementById('video');
        videoElement.pause();
        videoElement.removeAttribute('src'); // empty source
        videoElement.load();

        setIsVideoFromCamera(false)
        setIsVideoFromFile(false)
        document.getElementById("video_record").hidden = true;
        document.getElementById("video_input_id").style.display = "none";
        document.getElementById("start_source_button").disabled = false;
        document.getElementById("video").style.visibility = "hidden";
        stopVideo()
        var old_element = document.getElementById("video");
        var video = old_element.cloneNode(true);
        old_element.parentNode.replaceChild(video, old_element);
    }

    const changeToCamera = () => {
        window.streaming = false

        var videoElement = document.getElementById('video');
        videoElement.pause();
        videoElement.removeAttribute('src'); // empty source
        videoElement.load();

        setIsVideoFromCamera(true)
        setIsVideoFromFile(false) //.visibility = "hidden";
        document.getElementById("video_record").hidden = true;
        document.getElementById("video_input_id").style.display = "none";
        document.getElementById("start_source_button").disabled = false;
        document.getElementById("video").style.visibility = "hidden";

        stopVideo()

        var old_element = document.getElementById("video");
        var video = old_element.cloneNode(true);

        old_element.parentNode.replaceChild(video, old_element);

    }

    const changeToFile = () => {
        window.streaming = false
        setIsVideoFromFile(true)
        setIsVideoFromCamera(false)
        document.getElementById("video_record").hidden = true;
        document.getElementById("video_input_id").style.display = "";
        document.getElementById("start_source_button").disabled = true;
        //  document.getElementById("video").style.visibility = "hidden";
        var old_element = document.getElementById("video");
        var video = old_element.cloneNode(true);
        old_element.parentNode.replaceChild(video, old_element);

        stopVideo()
    }

    const selectedVideo = (event) => {
        var old_element = document.getElementById("video");
        var video = old_element.cloneNode(true);
        old_element.parentNode.replaceChild(video, old_element);
        stopVideo()

        console.log(event.target.files[0])
        var file = event.target.files[0]
        var reader = new FileReader();
        reader.onload = function(e) {

            var src = e.target.result
            var video = document.getElementById("video")
            video.onplay = function() {
                console.log("PLAYING VIDEO FILE!!")
            }

            video.setAttribute("src", src)
            video.style.visibility = ""
            document.getElementById("start_record_button").disabled = false; //id="start_source_button"
            document.getElementById("start_source_button").disabled = true;
            setSourceActivated(true)
            ctx = new AudioContext();
            sourceForAudio = ctx.createMediaElementSource(video); //ctx.createMediaElementSource(video);
            setAudioSourceConnected(true)

            audioStream = ctx.createMediaStreamDestination();

            // connect the source to the MediaStream
            sourceForAudio.connect(audioStream);


            var intervalPlay = setInterval(() => {

                if (video.videoHeight > 0) {
                    // video.height = video.videoHeight
                    // video.width = video.videoWidth

                    video.height = parseInt(window.customVideowidth * video.videoHeight / video.videoWidth)
                    video.width = window.customVideowidth
                    console.log("VIDEO SIZE:", video.height, video.width)

                    console.log(video.width, video.height, "Interval Cleared")
                    const canvas = document.getElementById(outputCanvasVideoId)
                    // const vid = document.getElementById("localVideo");
                    const vidStyleData = video.getBoundingClientRect();
                    canvas.style.width = vidStyleData.width + "px";
                    canvas.style.height = vidStyleData.height + "px";
                    canvas.style.left = vidStyleData.left + "px";
                    canvas.style.top = vidStyleData.top + "px";

                    clearInterval(intervalPlay)
                    window.streaming = true

                    //We copy from the video html element to canvas
                    let src_v = new cv.Mat(video.height, video.width, cv.CV_8UC4);
                    let dst_v = new cv.Mat(video.height, video.width, cv.CV_8UC1);
                    let cap = new cv.VideoCapture(video);

                    const FPS = window.FPS;
                    window.streaming = false

                    function processVideo() {
                        try {
                            if (!window.streaming) {
                                // clean and stop.
                                src_v.delete();
                                dst_v.delete();
                                console.log("Canny Edge Stopped")
                                // delete cap;
                                window.activeEffect = false
                                return;
                            }
                            let begin = Date.now();
                            // start processing.
                            cap.read(src_v);
                            cv.imshow(outputCanvasVideoId, src_v);
                            // schedule the next one.
                            let delay = 1000 / FPS - (Date.now() - begin);
                            // console.log("not stoping",delay,window.streaming)
                            setTimeout(processVideo, delay);
                        } catch (err) {
                            //utils.printError(err);
                            console.log(err)
                        }
                    };

                    var waitEffectInterval = setInterval(() => {
                        console.log("canny", window.activeEffect, window.streaming)
                        if (!window.activeEffect) {
                            window.activeEffect = true
                            window.streaming = true

                            setTimeout(processVideo, 100);

                            console.log("PLAYING AUDIO FOR VIDEO FILE")
                            var out = document.getElementById("out")
                            out.muted = false;
                            out.srcObject = audioStream.stream
                            out.play()

                            clearInterval(waitEffectInterval)
                        }

                    }, 10);
                    //We copy from the video html element to canvas END///////////
                }
                console.log("Interval Not Cleared")
            }, [100])
        }
        reader.readAsDataURL(file)
    }

    const stopVideo = () => {
        let video = document.getElementById(inputVideoId);
        video.height = 0
        video.width = 0
        video.currentTime = 0
        video.pause()
        if (videoStream) {
            stopBothVideoAndAudio(videoStream)
        }
        if (audioStream) {
            stopBothVideoAndAudio(audioStream)
        }
        if (ctx) {
            ctx.close()
        }

        setIsVideoStopped(true)
        setSourceActivated(false)
        if (!isVideoFromFile) {
            document.getElementById("start_record_button").disabled = true;
        }
    }


    return (
   <>
     <Button id="start_source_button" hidden={!isVideoStopped} className="m-1" block onClick={captureVideo}>Start</Button>
     <Button hidden={isVideoStopped} variant="danger" className="m-1" block onClick={stopVideo}>Stop</Button>
     <Button className="m-1" block onClick={handleModalShow}>Effect</Button>
     <Button className="m-1" block onClick={deleteEffectsVideo}>No Effect</Button>
     <ButtonGroup className="m-1">
       <ToggleButton id={`radio-video-screen`} type="radio" variant='outline-success' name="radio-v" value={0} checked={isVideoFromCamera===false && isVideoFromFile===false} onChange={changeToScreen}> Screen </ToggleButton>
       <ToggleButton id={`radio-video-camera`} type="radio" variant='outline-success' name="radio-v" value={1} checked={isVideoFromCamera===true && isVideoFromFile===false} onChange={changeToCamera}> Camera </ToggleButton>
       <ToggleButton id={`radio-video-file`} type="radio" variant='outline-success' name="radio-v" value={2} checked={isVideoFromFile===true && isVideoFromCamera===false} onChange={changeToFile}> File </ToggleButton>
     </ButtonGroup>
     
     <source id="sourceVideo" type="video/mp4" />
     <input id="video_input_id" style={{display:"none"}} type="file" accept="video/*" onChange={(e)=>(selectedVideo(e))}/>

   </>
    )
}

export default VideoSource