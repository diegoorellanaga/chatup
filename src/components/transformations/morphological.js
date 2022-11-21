import {React, useState,useEffect,useCallback} from 'react'
import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
var cv = require('opencv.js');

const Morphological = ({inputCanvasId,isVideo,outputCanvasId,outputCanvasIdShow,setCanDownload}) => {
    
  const [show,setShow] = useState(false)
   // const [subMorphological, setSubMorphological] = useState("gaussian_blur"); medianBlur
    
    const erosion = () => {

        let iterations;
        let ksize_x;
        let ksize_y;

        let iterations_id = "iterations_id";
        let ksize_x_id = "ksize_x_id";
        let ksize_y_id = "ksize_y_id";


        if(document.getElementById(iterations_id).value && document.getElementById(ksize_x_id).value && document.getElementById(ksize_y_id).value){
         ksize_x = Math.abs(parseInt(document.getElementById(ksize_x_id).value))
         ksize_y = Math.abs(parseInt(document.getElementById(ksize_y_id).value))
         iterations = Math.abs(parseInt(document.getElementById(iterations_id).value))
        }else{
          ksize_x = 5
          ksize_y = 5
          iterations = 1
        }
        document.getElementById(iterations_id).value = iterations
        document.getElementById(ksize_x_id).value = ksize_x
        document.getElementById(ksize_y_id).value = ksize_y

        if(!isVideo){
          setShow(true)
        setTimeout(()=>{
        let src = cv.imread(inputCanvasId);
        let dst = new cv.Mat();
        let M = cv.Mat.ones(ksize_x, ksize_y, cv.CV_8U);
        let anchor = new cv.Point(-1, -1);
        // You can try more different parameters
        cv.erode(src, dst, M, anchor, iterations, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
        cv.imshow(outputCanvasId, dst);
        src.delete(); dst.delete();


        let src1 = cv.imread(outputCanvasId);
        let dst1 = new cv.Mat();
        let newSize1 = window.canvasSize
        let dsize1 = new cv.Size(newSize1,parseInt((newSize1*src1.rows)/src1.cols));
        // You can try more different parameters
        cv.resize(src1, dst1, dsize1, 0, 0, cv.INTER_AREA);
        cv.imshow(outputCanvasIdShow, dst1);
        src1.delete(); dst1.delete();


        setShow(false)
      },[10])


        setCanDownload(true)

      }else{


        let video = document.getElementById('video');
        let src_v = new cv.Mat(video.height, video.width, cv.CV_8UC4);
        let src_v_c = new cv.Mat(video.height, video.width, cv.CV_8UC4);
        let dst_v  = new cv.Mat(video.height, video.width, cv.CV_8UC1);
        let M = cv.Mat.ones(ksize_x, ksize_y, cv.CV_8U);
        let anchor = new cv.Point(-1, -1);
        let cap = new cv.VideoCapture(video);
      //  console.log("canny edge inputs",ksize_x,ksize_y)
      
        const FPS =window.FPS;
        window.streaming = false
      
        function processVideo() {
            try {
                if (!window.streaming) {
                    // clean and stop.
                    src_v .delete();
                    dst_v .delete();
                    console.log("Canny Edge Stopped")
                    window.activeEffect = false
                    return;
                }
                let begin = Date.now();
                // start processing.
                cap.read(src_v );
                cv.erode(src_v, dst_v, M, anchor, iterations, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
                cv.imshow('canvasOutput', dst_v );
                let delay = 1000 / FPS - (Date.now() - begin);
                setTimeout(processVideo, delay);
            } catch (err) {
                //utils.printError(err);
                console.log(err)
            }

      }

      var waitEffectInterval =  setInterval(() => {
        console.log("canny",window.activeEffect,window.streaming)
        if(!window.activeEffect){
          window.activeEffect = true
          window.streaming = true
         
          setTimeout(processVideo, 1000);
          clearInterval(waitEffectInterval)
        }
        
      }, 10);






      }
    }

    const dilation = () => {

        let iterations;
        let ksize_x;
        let ksize_y;

        let iterations_id = "iterations_id_dil";
        let ksize_x_id = "ksize_x_id_dil";
        let ksize_y_id = "ksize_y_id_dil";


        if(document.getElementById(iterations_id).value && document.getElementById(ksize_x_id).value && document.getElementById(ksize_y_id).value){
         ksize_x = Math.abs(parseInt(document.getElementById(ksize_x_id).value))
         ksize_y = Math.abs(parseInt(document.getElementById(ksize_y_id).value))
         iterations = Math.abs(parseInt(document.getElementById(iterations_id).value))
        }else{
          ksize_x = 5
          ksize_y = 5
          iterations = 1
        }
        document.getElementById(iterations_id).value = iterations
        document.getElementById(ksize_x_id).value = ksize_x
        document.getElementById(ksize_y_id).value = ksize_y

        if(!isVideo){
          setShow(true)
        setTimeout(()=>{
      let src = cv.imread(inputCanvasId);
      let dst = new cv.Mat();
      let M = cv.Mat.ones(ksize_x, ksize_y, cv.CV_8U);
      let anchor = new cv.Point(-1, -1);
      // You can try more different parameters
      cv.dilate(src, dst, M, anchor, iterations, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
      cv.imshow(outputCanvasId, dst);
      console.log("dilation executed",inputCanvasId)
      src.delete(); dst.delete();

      let src1 = cv.imread(outputCanvasId);
      let dst1 = new cv.Mat();
      let newSize1 = window.canvasSize
      let dsize1 = new cv.Size(newSize1,parseInt((newSize1*src1.rows)/src1.cols));
      // You can try more different parameters
      cv.resize(src1, dst1, dsize1, 0, 0, cv.INTER_AREA);
      cv.imshow(outputCanvasIdShow, dst1);
      src1.delete(); dst1.delete();



      setShow(false)
    },[10])



      setCanDownload(true)

    }else{

      let video = document.getElementById('video');
      let src_v = new cv.Mat(video.height, video.width, cv.CV_8UC4);
      let src_v_c = new cv.Mat(video.height, video.width, cv.CV_8UC4);
      let dst_v  = new cv.Mat(video.height, video.width, cv.CV_8UC1);
      let M = cv.Mat.ones(ksize_x, ksize_y, cv.CV_8U);
      let anchor = new cv.Point(-1, -1);
      let cap = new cv.VideoCapture(video);
    //  console.log("canny edge inputs",ksize_x,ksize_y)
    
      const FPS =window.FPS;
      window.streaming = false
    
      function processVideo() {
          try {
              if (!window.streaming) {
                  // clean and stop.
                  src_v .delete();
                  dst_v .delete();
                  console.log("Canny Edge Stopped")
                  window.activeEffect = false
                  return;
              }
              let begin = Date.now();
              // start processing.
              cap.read(src_v );
              cv.dilate(src_v, dst_v, M, anchor, iterations, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
              cv.imshow('canvasOutput', dst_v );
              let delay = 1000 / FPS - (Date.now() - begin);
              setTimeout(processVideo, delay);
          } catch (err) {
              //utils.printError(err);
              console.log(err)
          }

    }

    var waitEffectInterval =  setInterval(() => {
      console.log("canny",window.activeEffect,window.streaming)
      if(!window.activeEffect){
        window.activeEffect = true
        window.streaming = true
       
        setTimeout(processVideo, 1000);
        clearInterval(waitEffectInterval)
      }
      
    }, 10);

    }
  }


    const opening = () => {

        let iterations;
        let ksize_x;
        let ksize_y;

        let iterations_id = "iterations_id_op";
        let ksize_x_id = "ksize_x_id_op";
        let ksize_y_id = "ksize_y_id_op";


        if(document.getElementById(iterations_id).value && document.getElementById(ksize_x_id).value && document.getElementById(ksize_y_id).value){
         ksize_x = Math.abs(parseInt(document.getElementById(ksize_x_id).value))
         ksize_y = Math.abs(parseInt(document.getElementById(ksize_y_id).value))
         iterations = Math.abs(parseInt(document.getElementById(iterations_id).value))
        }else{
          ksize_x = 5
          ksize_y = 5
          iterations = 1
        }
        document.getElementById(iterations_id).value = iterations
        document.getElementById(ksize_x_id).value = ksize_x
        document.getElementById(ksize_y_id).value = ksize_y



        if(!isVideo){
          setShow(true)
        setTimeout(()=>{
      let src = cv.imread(inputCanvasId);
      let dst = new cv.Mat();
      let M = cv.Mat.ones(ksize_x, ksize_y, cv.CV_8U);
      let anchor = new cv.Point(-1, -1);
      // You can try more different parameters
      cv.morphologyEx(src, dst, cv.MORPH_OPEN, M, anchor, iterations,
                      cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
      cv.imshow(outputCanvasId, dst);
      src.delete(); dst.delete();

      let src1 = cv.imread(outputCanvasId);
      let dst1 = new cv.Mat();
      let newSize1 = window.canvasSize
      let dsize1 = new cv.Size(newSize1,parseInt((newSize1*src1.rows)/src1.cols));
      // You can try more different parameters
      cv.resize(src1, dst1, dsize1, 0, 0, cv.INTER_AREA);
      cv.imshow(outputCanvasIdShow, dst1);
      src1.delete(); dst1.delete();



      setShow(false)
    },[10])

      setCanDownload(true)

    }else{


      let video = document.getElementById('video');
      let src_v = new cv.Mat(video.height, video.width, cv.CV_8UC4);
      let dst_v  = new cv.Mat(video.height, video.width, cv.CV_8UC1);
      let M = cv.Mat.ones(ksize_x, ksize_y, cv.CV_8U);
      let anchor = new cv.Point(-1, -1);
      let cap = new cv.VideoCapture(video);
    //  console.log("canny edge inputs",ksize_x,ksize_y)
    
      const FPS =window.FPS;
      window.streaming = false
    
      function processVideo() {
          try {
              if (!window.streaming) {
                  // clean and stop.
                  src_v .delete();
                  dst_v .delete();
                  console.log("Canny Edge Stopped")
                  window.activeEffect = false
                  return;
              }
              let begin = Date.now();
              // start processing.
              cap.read(src_v );
              cv.morphologyEx(src_v, dst_v, cv.MORPH_OPEN, M, anchor, iterations,
                cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
              cv.imshow('canvasOutput', dst_v );
              let delay = 1000 / FPS - (Date.now() - begin);
              setTimeout(processVideo, delay);
          } catch (err) {
              //utils.printError(err);
              console.log(err)
          }

    }

    var waitEffectInterval =  setInterval(() => {
      console.log("canny",window.activeEffect,window.streaming)
      if(!window.activeEffect){
        window.activeEffect = true
        window.streaming = true
       
        setTimeout(processVideo, 1000);
        clearInterval(waitEffectInterval)
      }
      
    }, 10);
    }
    }
    
    const closing = () => {
     

        let ksize_x;
        let ksize_y;


        let ksize_x_id = "ksize_x_id_cl";
        let ksize_y_id = "ksize_y_id_cl";


        if( document.getElementById(ksize_x_id).value && document.getElementById(ksize_y_id).value){
         ksize_x = Math.abs(parseInt(document.getElementById(ksize_x_id).value))
         ksize_y = Math.abs(parseInt(document.getElementById(ksize_y_id).value))

        }else{
          ksize_x = 5
          ksize_y = 5

        }

        document.getElementById(ksize_x_id).value = ksize_x
        document.getElementById(ksize_y_id).value = ksize_y


        if(!isVideo){
          setShow(true)
        setTimeout(()=>{
      let src = cv.imread(inputCanvasId);
      let dst = new cv.Mat();
      let M = cv.Mat.ones(ksize_x, ksize_y, cv.CV_8U);
      // You can try more different parameters //morphologicalGradient
      cv.morphologyEx(src, dst, cv.MORPH_CLOSE, M);
      cv.imshow(outputCanvasId, dst);
      src.delete(); dst.delete();

      let src1 = cv.imread(outputCanvasId);
      let dst1 = new cv.Mat();
      let newSize1 = window.canvasSize
      let dsize1 = new cv.Size(newSize1,parseInt((newSize1*src1.rows)/src1.cols));
      // You can try more different parameters
      cv.resize(src1, dst1, dsize1, 0, 0, cv.INTER_AREA);
      cv.imshow(outputCanvasIdShow, dst1);
      src1.delete(); dst1.delete();



      setShow(false)
    },[10])


      setCanDownload(true)

    }else{



      let video = document.getElementById('video');
      let src_v = new cv.Mat(video.height, video.width, cv.CV_8UC4);
      let dst_v  = new cv.Mat(video.height, video.width, cv.CV_8UC1);
      let M = cv.Mat.ones(ksize_x, ksize_y, cv.CV_8U);
      let cap = new cv.VideoCapture(video);
    //  console.log("canny edge inputs",ksize_x,ksize_y)
    
      const FPS =window.FPS;
      window.streaming = false
    
      function processVideo() {
          try {
              if (!window.streaming) {
                  // clean and stop.
                  src_v .delete();
                  dst_v .delete();
                  console.log("Canny Edge Stopped")
                  window.activeEffect = false
                  return;
              }
              let begin = Date.now();
              // start processing.
              cap.read(src_v );
              cv.morphologyEx(src_v, dst_v, cv.MORPH_CLOSE, M);
              cv.imshow('canvasOutput', dst_v );
              let delay = 1000 / FPS - (Date.now() - begin);
              setTimeout(processVideo, delay);
          } catch (err) {
              //utils.printError(err);
              console.log(err)
          }

    }

    var waitEffectInterval =  setInterval(() => {
      console.log("canny",window.activeEffect,window.streaming)
      if(!window.activeEffect){
        window.activeEffect = true
        window.streaming = true
       
        setTimeout(processVideo, 1000);
        clearInterval(waitEffectInterval)
      }
      
    }, 10);



    }
    }

    const morphologicalGradient = () => {


        let ksize_x;
        let ksize_y;

        let ksize_x_id = "ksize_x_id_mg";
        let ksize_y_id = "ksize_y_id_mg";


        if(document.getElementById(ksize_x_id).value && document.getElementById(ksize_y_id).value){
         ksize_x = Math.abs(parseInt(document.getElementById(ksize_x_id).value))
         ksize_y = Math.abs(parseInt(document.getElementById(ksize_y_id).value))
        }else{
          ksize_x = 5
          ksize_y = 5
        }
        document.getElementById(ksize_x_id).value = ksize_x
        document.getElementById(ksize_y_id).value = ksize_y

        if(!isVideo){
          setShow(true)
        setTimeout(()=>{
      let src = cv.imread(inputCanvasId);
      cv.cvtColor(src, src, cv.COLOR_RGBA2RGB);
      let dst = new cv.Mat();
      let M = cv.Mat.ones(ksize_x, ksize_y, cv.CV_8U);
      // You can try more different parameters
      cv.morphologyEx(src, dst, cv.MORPH_GRADIENT, M);
      cv.imshow(outputCanvasId, dst);
      src.delete(); dst.delete();


      let src1 = cv.imread(outputCanvasId);
      let dst1 = new cv.Mat();
      let newSize1 = window.canvasSize
      let dsize1 = new cv.Size(newSize1,parseInt((newSize1*src1.rows)/src1.cols));
      // You can try more different parameters
      cv.resize(src1, dst1, dsize1, 0, 0, cv.INTER_AREA);
      cv.imshow(outputCanvasIdShow, dst1);
      src1.delete(); dst1.delete();


      setShow(false)
    },[10])

      setCanDownload(true)

    }else{



      let video = document.getElementById('video');
      let src_v = new cv.Mat(video.height, video.width, cv.CV_8UC4);
      let src_v_c = new cv.Mat(video.height, video.width, cv.CV_8UC4);
      let dst_v  = new cv.Mat(video.height, video.width, cv.CV_8UC1);
      let M = cv.Mat.ones(ksize_x, ksize_y, cv.CV_8U);
      let cap = new cv.VideoCapture(video);
    //  console.log("canny edge inputs",ksize_x,ksize_y)
    
      const FPS =window.FPS;
      window.streaming = false
    
      function processVideo() {
          try {
              if (!window.streaming) {
                  // clean and stop.
                  src_v .delete();
                  dst_v .delete();
                  console.log("Canny Edge Stopped")
                  window.activeEffect = false
                  return;
              }
              let begin = Date.now();
              // start processing.
              cap.read(src_v );
              cv.cvtColor(src_v, src_v_c, cv.COLOR_RGBA2RGB);
              cv.morphologyEx(src_v_c, dst_v, cv.MORPH_GRADIENT, M);
              cv.imshow('canvasOutput', dst_v );
              let delay = 1000 / FPS - (Date.now() - begin);
              setTimeout(processVideo, delay);
          } catch (err) {
              //utils.printError(err);
              console.log(err)
          }

    }

    var waitEffectInterval =  setInterval(() => {
      console.log("canny",window.activeEffect,window.streaming)
      if(!window.activeEffect){
        window.activeEffect = true
        window.streaming = true
       
        setTimeout(processVideo, 100);
        clearInterval(waitEffectInterval)
      }
      
    }, 10);



    }

    }

    const topHat = () => {
  

        let ksize_x;
        let ksize_y;

        let ksize_x_id = "ksize_x_id_th";
        let ksize_y_id = "ksize_y_id_th";


        if(document.getElementById(ksize_x_id).value && document.getElementById(ksize_y_id).value){
         ksize_x = Math.abs(parseInt(document.getElementById(ksize_x_id).value))
         ksize_y = Math.abs(parseInt(document.getElementById(ksize_y_id).value))
        }else{
          ksize_x = 9
          ksize_y = 9
        }
        document.getElementById(ksize_x_id).value = ksize_x
        document.getElementById(ksize_y_id).value = ksize_y


        if(!isVideo){
          setShow(true)
        setTimeout(()=>{
      let src = cv.imread(inputCanvasId);
      cv.cvtColor(src, src, cv.COLOR_RGBA2RGB);
      let dst = new cv.Mat();
      let M = cv.Mat.ones(ksize_x, ksize_y, cv.CV_8U);
      // You can try more different parameters
      cv.morphologyEx(src, dst, cv.MORPH_TOPHAT, M);
      cv.imshow(outputCanvasId, dst);
      src.delete(); dst.delete();

      let src1 = cv.imread(outputCanvasId);
      let dst1 = new cv.Mat();
      let newSize1 = window.canvasSize
      let dsize1 = new cv.Size(newSize1,parseInt((newSize1*src1.rows)/src1.cols));
      // You can try more different parameters
      cv.resize(src1, dst1, dsize1, 0, 0, cv.INTER_AREA);
      cv.imshow(outputCanvasIdShow, dst1);
      src1.delete(); dst1.delete();


      setShow(false)
    },[10])

      setCanDownload(true)

    }else{



      let video = document.getElementById('video');
      let src_v = new cv.Mat(video.height, video.width, cv.CV_8UC4);
      let src_v_c = new cv.Mat(video.height, video.width, cv.CV_8UC4);
      let dst_v  = new cv.Mat(video.height, video.width, cv.CV_8UC1);
      let M = cv.Mat.ones(ksize_x, ksize_y, cv.CV_8U);
      let cap = new cv.VideoCapture(video);
    //  console.log("canny edge inputs",ksize_x,ksize_y)
    
      const FPS =window.FPS;
      window.streaming = false
    
      function processVideo() {
          try {
              if (!window.streaming) {
                  // clean and stop.
                  src_v .delete();
                  dst_v .delete();
                  console.log("Canny Edge Stopped")
                  window.activeEffect = false
                  return;
              }
              let begin = Date.now();
              // start processing.
              cap.read(src_v );
              cv.cvtColor(src_v, src_v_c, cv.COLOR_RGBA2RGB);
              cv.morphologyEx(src_v_c, dst_v, cv.MORPH_TOPHAT, M);
              cv.imshow('canvasOutput', dst_v );
              let delay = 1000 / FPS - (Date.now() - begin);
              setTimeout(processVideo, delay);
          } catch (err) {
              //utils.printError(err);
              console.log(err)
          }

    }

    var waitEffectInterval =  setInterval(() => {
      console.log("canny",window.activeEffect,window.streaming)
      if(!window.activeEffect){
        window.activeEffect = true
        window.streaming = true
       
        setTimeout(processVideo, 100);
        clearInterval(waitEffectInterval)
      }
      
    }, 10);


    }

    }

    const blackHat = () => {
     

        let ksize_x;
        let ksize_y;

        let ksize_x_id = "ksize_x_id_bh";
        let ksize_y_id = "ksize_y_id_bh";


        if(document.getElementById(ksize_x_id).value && document.getElementById(ksize_y_id).value){
         ksize_x = Math.abs(parseInt(document.getElementById(ksize_x_id).value))
         ksize_y = Math.abs(parseInt(document.getElementById(ksize_y_id).value))
        }else{
          ksize_x = 53
          ksize_y = 53
        }
        document.getElementById(ksize_x_id).value = ksize_x
        document.getElementById(ksize_y_id).value = ksize_y

        if(!isVideo){
          setShow(true)
        setTimeout(()=>{
      let src = cv.imread(inputCanvasId);
      cv.cvtColor(src, src, cv.COLOR_RGBA2RGB);
      let dst = new cv.Mat();
      let M = cv.Mat.ones(ksize_x, ksize_y, cv.CV_8U);
      // You can try more different parameters
      cv.morphologyEx(src, dst, cv.MORPH_BLACKHAT, M);
      cv.imshow(outputCanvasId, dst);
      src.delete(); dst.delete();


      let src1 = cv.imread(outputCanvasId);
      let dst1 = new cv.Mat();
      let newSize1 = window.canvasSize
      let dsize1 = new cv.Size(newSize1,parseInt((newSize1*src1.rows)/src1.cols));
      // You can try more different parameters
      cv.resize(src1, dst1, dsize1, 0, 0, cv.INTER_AREA);
      cv.imshow(outputCanvasIdShow, dst1);
      src1.delete(); dst1.delete();


      setShow(false)
    },[10])

      setCanDownload(true)

    }else{


      let video = document.getElementById('video');
      let src_v = new cv.Mat(video.height, video.width, cv.CV_8UC4);
      let src_v_c = new cv.Mat(video.height, video.width, cv.CV_8UC4);
      let dst_v  = new cv.Mat(video.height, video.width, cv.CV_8UC1);
      let M = cv.Mat.ones(ksize_x, ksize_y, cv.CV_8U);
      let cap = new cv.VideoCapture(video);
    //  console.log("canny edge inputs",ksize_x,ksize_y)
    
      const FPS =window.FPS;
      window.streaming = false
    
      function processVideo() {
          try {
              if (!window.streaming) {
                  // clean and stop.
                  src_v .delete();
                  dst_v .delete();
                  console.log("Canny Edge Stopped")
                  window.activeEffect = false
                  return;
              }
              let begin = Date.now();
              // start processing.
              cap.read(src_v );
              cv.cvtColor(src_v, src_v_c, cv.COLOR_RGBA2RGB);
              cv.morphologyEx(src_v_c, dst_v, cv.MORPH_BLACKHAT, M);
              cv.imshow('canvasOutput', dst_v );
              let delay = 1000 / FPS - (Date.now() - begin);
              setTimeout(processVideo, delay);
          } catch (err) {
              //utils.printError(err);
              console.log(err)
          }

    }

    var waitEffectInterval =  setInterval(() => {
      console.log("canny",window.activeEffect,window.streaming)
      if(!window.activeEffect){
        window.activeEffect = true
        window.streaming = true
       
        setTimeout(processVideo, 100);
        clearInterval(waitEffectInterval)
      }
      
    }, 10);
    }


    }


    const [subMorphologicalTransformationOptions,setSubMorphologicalTransformationOptions] = useState(<Card>
                                                                                                <Card.Header>
                                                                                                  <Card.Title>Erosion</Card.Title>
                                                                                                </Card.Header>
                                                                                                <Card.Body>
                                                                                                  <Form.Group className="mb-3">
                                                                                                  <Form.Text className="text-muted"> The Kernel Size </Form.Text>
                                                                                                    <div style={{display: "grid",gridTemplateColumns: "repeat(2, 1fr)"}}>
                                                                                                      <div style={{display:"flex",flexDirection: "column"}}>
                                                                                                        <InputGroup className="mb-3">
                                                                                                          <InputGroup.Text id="ksize_x_label_er">X:</InputGroup.Text>
                                                                                                          <Form.Control aria-describedby="ksize_x_label_er" id="ksize_x_id" type="number" placeholder="5" />
                                                                                                        </InputGroup>
                                                                                                      </div>
                                                                                                      <div style={{display:"flex",flexDirection: "column"}}>
                                                                                                        <InputGroup className="mb-3">
                                                                                                          <InputGroup.Text id="ksize_y_label_er">Y:</InputGroup.Text>
                                                                                                          <Form.Control aria-describedby="ksize_y_label_er" id="ksize_y_id" type="number" placeholder="5" />
                                                                                                        </InputGroup>
                                                                                                      </div>
                                                                                                    </div>
                                                                                                    <InputGroup className="mb-3">
                                                                                                          <InputGroup.Text id="ksize_z_label_er">Iterations:</InputGroup.Text>
                                                                                                          <Form.Control aria-describedby="ksize_z_label_er" id="iterations_id" type="number" placeholder="1" />
                                                                                                        </InputGroup>
                                                                                                  </Form.Group>
                                                                                                </Card.Body>
                                                                                                <Card.Footer>
                                                                                                  <Button onClick={erosion}>Erosion</Button>
                                                                                                </Card.Footer>
                                                                                              </Card>
                                                                                               )


                                                                                               
      const handleSelect = (eventKey) => {
    
        switch(eventKey){
          case "erosion":
          setSubMorphologicalTransformationOptions(<Card>
                                                     <Card.Header>
                                                       <Card.Title>Erosion</Card.Title>
                                                     </Card.Header>
                                                     <Card.Body>
                                                       <Form.Group className="mb-3">
                                                       <Form.Text className="text-muted"> The Kernel Size </Form.Text>
                                                         <div style={{display: "grid",gridTemplateColumns: "repeat(2, 1fr)"}}>
                                                           <div style={{display:"flex",flexDirection: "column"}}>
                                                             <InputGroup className="mb-3">
                                                               <InputGroup.Text id="ksize_x_label_er">X:</InputGroup.Text>
                                                               <Form.Control aria-describedby="ksize_x_label_er" id="ksize_x_id" type="number" placeholder="5" />
                                                             </InputGroup>
                                                           </div>
                                                           <div style={{display:"flex",flexDirection: "column"}}>
                                                             <InputGroup className="mb-3">
                                                               <InputGroup.Text id="ksize_y_label_er">Y:</InputGroup.Text>
                                                               <Form.Control aria-describedby="ksize_y_label_er" id="ksize_y_id" type="number" placeholder="5" />
                                                             </InputGroup>
                                                           </div>
                                                         </div>
                                                         <InputGroup className="mb-3">
                                                               <InputGroup.Text id="ksize_z_label_er">Iterations:</InputGroup.Text>
                                                               <Form.Control aria-describedby="ksize_z_label_er" id="iterations_id" type="number" placeholder="1" />
                                                             </InputGroup>
                                                       </Form.Group>
                                                     </Card.Body>
                                                     <Card.Footer>
                                                       <Button onClick={erosion}>Erosion</Button>
                                                     </Card.Footer>
                                                   </Card>
                                                    )
          break
          case "dilation":
          setSubMorphologicalTransformationOptions(<Card>
                                                     <Card.Header>
                                                       <Card.Title>Dilation</Card.Title>
                                                     </Card.Header>
                                                     <Card.Body>
                                                       <Form.Group className="mb-3">
                                                       <Form.Text className="text-muted"> The Kernel Size </Form.Text>
                                                         <div style={{display: "grid",gridTemplateColumns: "repeat(2, 1fr)"}}>
                                                           <div style={{display:"flex",flexDirection: "column"}}>
                                                             <InputGroup className="mb-3">
                                                               <InputGroup.Text id="ksize_x_label_er_dil">X:</InputGroup.Text>
                                                               <Form.Control aria-describedby="ksize_x_label_er_dil" id="ksize_x_id_dil" type="number" placeholder="5" />
                                                             </InputGroup>
                                                           </div>
                                                           <div style={{display:"flex",flexDirection: "column"}}>
                                                             <InputGroup className="mb-3">
                                                               <InputGroup.Text id="ksize_y_label_er_dil">Y:</InputGroup.Text>
                                                               <Form.Control aria-describedby="ksize_y_label_er_dil" id="ksize_y_id_dil" type="number" placeholder="5" />
                                                             </InputGroup>
                                                           </div>
                                                         </div>
                                                         <InputGroup className="mb-3">
                                                               <InputGroup.Text id="ksize_z_label_er_dil">Iterations:</InputGroup.Text>
                                                               <Form.Control aria-describedby="ksize_z_label_er_dil" id="iterations_id_dil" type="number" placeholder="1" />
                                                             </InputGroup>
                                                       </Form.Group>
                                                     </Card.Body>
                                                     <Card.Footer>
                                                       <Button onClick={dilation}>Dilation</Button>
                                                     </Card.Footer>
                                                   </Card>)
          break
          case "opening":
          setSubMorphologicalTransformationOptions(<Card>
                                                     <Card.Header>
                                                       <Card.Title>Opening</Card.Title>
                                                     </Card.Header>
                                                     <Card.Body>
                                                       <Form.Group className="mb-3">
                                                       <Form.Text className="text-muted"> The Kernel Size </Form.Text>
                                                         <div style={{display: "grid",gridTemplateColumns: "repeat(2, 1fr)"}}>
                                                           <div style={{display:"flex",flexDirection: "column"}}>
                                                             <InputGroup className="mb-3">
                                                               <InputGroup.Text id="ksize_x_label_er_op">X:</InputGroup.Text>
                                                               <Form.Control aria-describedby="ksize_x_label_er_op" id="ksize_x_id_op" type="number" placeholder="5" />
                                                             </InputGroup>
                                                           </div>
                                                           <div style={{display:"flex",flexDirection: "column"}}>
                                                             <InputGroup className="mb-3">
                                                               <InputGroup.Text id="ksize_y_label_er_op">Y:</InputGroup.Text>
                                                               <Form.Control aria-describedby="ksize_y_label_er_op" id="ksize_y_id_op" type="number" placeholder="5" />
                                                             </InputGroup>
                                                           </div>
                                                         </div>
                                                         <InputGroup className="mb-3">
                                                               <InputGroup.Text id="ksize_z_label_er_op">Iterations:</InputGroup.Text>
                                                               <Form.Control aria-describedby="ksize_z_label_er_op" id="iterations_id_op" type="number" placeholder="1" />
                                                             </InputGroup>
                                                       </Form.Group>
                                                     </Card.Body>
                                                     <Card.Footer>
                                                       <Button onClick={opening}>Opening</Button>
                                                     </Card.Footer>
                                                   </Card>)
          break
          case "closing":
          setSubMorphologicalTransformationOptions(<Card>
                                                     <Card.Header>
                                                       <Card.Title>Closing</Card.Title>
                                                     </Card.Header>
                                                     <Card.Body>
                                                       <Form.Group className="mb-3">
                                                       <Form.Text className="text-muted"> The Kernel Size </Form.Text>
                                                         <div style={{display: "grid",gridTemplateColumns: "repeat(2, 1fr)"}}>
                                                           <div style={{display:"flex",flexDirection: "column"}}>
                                                             <InputGroup className="mb-3">
                                                               <InputGroup.Text id="ksize_x_label_er_cl">X:</InputGroup.Text>
                                                               <Form.Control aria-describedby="ksize_x_label_er_cl" id="ksize_x_id_cl" type="number" placeholder="5" />
                                                             </InputGroup>
                                                           </div>
                                                           <div style={{display:"flex",flexDirection: "column"}}>
                                                             <InputGroup className="mb-3">
                                                               <InputGroup.Text id="ksize_y_label_er_cl">Y:</InputGroup.Text>
                                                               <Form.Control aria-describedby="ksize_y_label_er_cl" id="ksize_y_id_cl" type="number" placeholder="5" />
                                                             </InputGroup>
                                                           </div>
                                                         </div>
                                                       </Form.Group>
                                                     </Card.Body>
                                                     <Card.Footer>
                                                       <Button onClick={closing}>Closing</Button>
                                                     </Card.Footer>
                                                   </Card>)
          break
          case "morph_gradient":
          setSubMorphologicalTransformationOptions(<Card>
                                                     <Card.Header>
                                                       <Card.Title>Morphological Gradient</Card.Title>
                                                     </Card.Header>
                                                     <Card.Body>
                                                       <Form.Group className="mb-3">
                                                       <Form.Text className="text-muted"> The Kernel Size </Form.Text>
                                                         <div style={{display: "grid",gridTemplateColumns: "repeat(2, 1fr)"}}>
                                                           <div style={{display:"flex",flexDirection: "column"}}>
                                                             <InputGroup className="mb-3">
                                                               <InputGroup.Text id="ksize_x_label_er_mg">X:</InputGroup.Text>
                                                               <Form.Control aria-describedby="ksize_x_label_er_mg" id="ksize_x_id_mg" type="number" placeholder="5" />
                                                             </InputGroup>
                                                           </div>
                                                           <div style={{display:"flex",flexDirection: "column"}}>
                                                             <InputGroup className="mb-3">
                                                               <InputGroup.Text id="ksize_y_label_er_mg">Y:</InputGroup.Text>
                                                               <Form.Control aria-describedby="ksize_y_label_er_mg" id="ksize_y_id_mg" type="number" placeholder="5" />
                                                             </InputGroup>
                                                           </div>
                                                         </div>
                                                       </Form.Group>
                                                     </Card.Body>
                                                     <Card.Footer>
                                                       <Button onClick={morphologicalGradient}>Morphological Gradient</Button>
                                                     </Card.Footer>
                                                   </Card>)
          break
          case "top_hat":
          setSubMorphologicalTransformationOptions(<Card>
                                                     <Card.Header>
                                                       <Card.Title>Top Hat</Card.Title>
                                                     </Card.Header>
                                                     <Card.Body>
                                                       <Form.Group className="mb-3">
                                                       <Form.Text className="text-muted"> The Kernel Size </Form.Text>
                                                         <div style={{display: "grid",gridTemplateColumns: "repeat(2, 1fr)"}}>
                                                           <div style={{display:"flex",flexDirection: "column"}}>
                                                             <InputGroup className="mb-3">
                                                               <InputGroup.Text id="ksize_x_label_er_th">X:</InputGroup.Text>
                                                               <Form.Control aria-describedby="ksize_x_label_er_th" id="ksize_x_id_th" type="number" placeholder="9" />
                                                             </InputGroup>
                                                           </div>
                                                           <div style={{display:"flex",flexDirection: "column"}}>
                                                             <InputGroup className="mb-3">
                                                               <InputGroup.Text id="ksize_y_label_er_th">Y:</InputGroup.Text>
                                                               <Form.Control aria-describedby="ksize_y_label_er_th" id="ksize_y_id_th" type="number" placeholder="9" />
                                                             </InputGroup>
                                                           </div>
                                                         </div>
                                                       </Form.Group>
                                                     </Card.Body>
                                                     <Card.Footer>
                                                       <Button onClick={topHat}>Top Hat</Button>
                                                     </Card.Footer>
                                                   </Card>)
          break
          case "black_hat":
          setSubMorphologicalTransformationOptions(<Card>
                                                     <Card.Header>
                                                       <Card.Title>Black Hat</Card.Title>
                                                     </Card.Header>
                                                     <Card.Body>
                                                       <Form.Group className="mb-3">
                                                       <Form.Text className="text-muted"> The Kernel Size </Form.Text>
                                                         <div style={{display: "grid",gridTemplateColumns: "repeat(2, 1fr)"}}>
                                                           <div style={{display:"flex",flexDirection: "column"}}>
                                                             <InputGroup className="mb-3">
                                                               <InputGroup.Text id="ksize_x_label_er_bh">X:</InputGroup.Text>
                                                               <Form.Control aria-describedby="ksize_x_label_er_bh" id="ksize_x_id_bh" type="number" placeholder="53" />
                                                             </InputGroup>
                                                           </div>
                                                           <div style={{display:"flex",flexDirection: "column"}}>
                                                             <InputGroup className="mb-3">
                                                               <InputGroup.Text id="ksize_y_label_er_bh">Y:</InputGroup.Text>
                                                               <Form.Control aria-describedby="ksize_y_label_er_bh" id="ksize_y_id_bh" type="number" placeholder="53" />
                                                             </InputGroup>
                                                           </div>
                                                         </div>
                                                       </Form.Group>
                                                     </Card.Body>
                                                     <Card.Footer>
                                                       <Button onClick={blackHat}>Black Hat</Button>
                                                     </Card.Footer>
                                                   </Card>)
          break
        }
      };                                                                                           

    return (
        <>
        <Card>
          <Card.Header>
            <Form.Group className="mb-3">
              <Form.Label>Morphological Transformations</Form.Label>
              <Form.Select
                       // value={subMorphological}
                        onChange={e => {
                        //   console.log("e.target.value", e.target.value);
                        //   setSubMorphological(e.target.value);
                          handleSelect(e.target.value)
                        }}
              >
                <option value="erosion">Erosion</option>
                <option value="dilation">Dilation</option>
                <option value="opening">Opening</option>
                <option value="closing">Closing</option>
                <option value="morph_gradient">Morphological Gradient</option>
                <option value="top_hat">Top Hat</option>
                <option value="black_hat">Black Hat</option>
              </Form.Select>
            </Form.Group>
          </Card.Header>
          <Card.Body>
              {subMorphologicalTransformationOptions}
          </Card.Body>
        </Card>
        <div hidden={!show} className="overlay-curtain">
     <div className="loader"></div>
</div>
        </>
    )
}

export default Morphological

// let src = cv.imread('canvasInput');  Morphological Gradient
// let dst = new cv.Mat();
// let ksize = new cv.Size(9, 9);
// // You can try more different parameters
// cv.GaussianBlur(src, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
// cv.imshow('canvasOutput', dst);
// src.delete(); dst.delete();