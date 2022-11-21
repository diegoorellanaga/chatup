
import {React, useState,useEffect,useCallback} from 'react'
import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
var cv = require('opencv.js');


const Gradients = ({inputCanvasId,isVideo,outputCanvasId,outputCanvasIdShow,setCanDownload}) => {
    
  const [show,setShow] = useState(false)
   // const [subGradients, setSubGradients] = useState("gaussian_blur"); medianBlur
    
    const laplacian = () => {



    
        let ksize;
        let scale;
        let delta;

        let ksize_input_id="ksize_id";
        let scale_input_id="scale_id";
        let delta_input_id="delta_id";


        if(document.getElementById(ksize_input_id).value && document.getElementById(scale_input_id).value && document.getElementById(delta_input_id).value){
            ksize = Math.abs(parseInt(document.getElementById(ksize_input_id).value))%2 == 1 ? Math.abs(parseInt(document.getElementById(ksize_input_id).value)): Math.abs(parseInt(document.getElementById(ksize_input_id).value))+1
            scale = parseInt(document.getElementById(scale_input_id).value)
            delta = parseInt(document.getElementById(delta_input_id).value)
        }else{
        ksize = 1;
        scale = 1;
        delta = 0;
        }
        document.getElementById(ksize_input_id).value = ksize
        document.getElementById(scale_input_id).value = scale
        document.getElementById(delta_input_id).value = delta
        

        if(!isVideo){
          setShow(true)
        setTimeout(()=>{
        let src = cv.imread(inputCanvasId);
        let dst = new cv.Mat();
        cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
        // You can try more different parameters
        cv.Laplacian(src, dst, cv.CV_8U, ksize, scale, delta, cv.BORDER_DEFAULT);
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
                cv.cvtColor(src_v, src_v_c, cv.COLOR_RGB2GRAY, 0);
                // You can try more different parameters
                cv.Laplacian(src_v_c, dst_v, cv.CV_8U, ksize, scale, delta, cv.BORDER_DEFAULT);
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

    
    const sobel = () => {
    
        // dx	order of the derivative x.
        // dy	order of the derivative y.
        // ksize	size of the extended Sobel kernel; it must be 1, 3, 5, or 7.
        // scale	optional scale factor for the computed derivative values.
        // delta	optional delta value that is added to the results prior to storing them in dst.
        //  1, 0, 3, 1, 0,
      let dx;
      let dy;
      let ksize;
      let scale;
      let delta;

      let dx_id="dx_id";
      let dy_id="dy_id";
      let ksize_id="ksize_id";
      let scale_id="scale_id";
      let delta_id="delta_id";

       dx=Math.abs(parseInt(document.getElementById(dx_id).value)) || Math.abs(parseInt(document.getElementById(dx_id).value))==0  ? Math.abs(parseInt(document.getElementById(dx_id).value)) : 1
       dy=Math.abs(parseInt(document.getElementById(dy_id).value)) ? Math.abs(parseInt(document.getElementById(dy_id).value)) : 0
       
       if(dx==0 && dy ==0){
         dx=1
         dy=0
       }
       
       if(Math.abs(parseInt(document.getElementById(ksize_id).value))){
       ksize= Math.abs(parseInt(document.getElementById(ksize_id).value))%2==1  ? Math.abs(parseInt(document.getElementById(ksize_id).value)) : Math.abs(parseInt(document.getElementById(ksize_id).value))+1
       }else{
        ksize = 3
       }
       scale=parseInt(document.getElementById(scale_id).value) ? parseInt(document.getElementById(scale_id).value) : 1
       delta=parseInt(document.getElementById(delta_id).value) ? parseInt(document.getElementById(delta_id).value) : 0

      
      document.getElementById(dx_id).value = dx ;  document.getElementById(dy_id).value = dy ; document.getElementById(ksize_id).value = ksize; document.getElementById(scale_id).value = scale; document.getElementById(delta_id).value = delta;

      if(!isVideo){
        setShow(true)
      setTimeout(()=>{
      let src = cv.imread(inputCanvasId);
      let dst = new cv.Mat();
     // let dsty = new cv.Mat();
      cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
      // You can try more different parameters
      cv.Sobel(src, dst, cv.CV_8U, dx, dy, ksize, scale, delta, cv.BORDER_DEFAULT);
     // cv.Sobel(src, dsty, cv.CV_8U, 0, 1, 3, 1, 0, cv.BORDER_DEFAULT);
      // cv.Scharr(src, dstx, cv.CV_8U, 1, 0, 1, 0, cv.BORDER_DEFAULT);
      // cv.Scharr(src, dsty, cv.CV_8U, 0, 1, 1, 0, cv.BORDER_DEFAULT);
    //  cv.imshow('canvasOutputx', dstx);
     // cv.imshow('canvasOutputy', dsty);
      cv.convertScaleAbs(dst, dst, 1, 0);
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
              cv.cvtColor(src_v, src_v_c, cv.COLOR_RGB2GRAY, 0);
              // You can try more different parameters
              cv.Sobel(src_v_c, dst_v, cv.CV_8U, dx, dy, ksize, scale, delta, cv.BORDER_DEFAULT);
              // cv.Sobel(src, dsty, cv.CV_8U, 0, 1, 3, 1, 0, cv.BORDER_DEFAULT);
               // cv.Scharr(src, dstx, cv.CV_8U, 1, 0, 1, 0, cv.BORDER_DEFAULT);
               // cv.Scharr(src, dsty, cv.CV_8U, 0, 1, 1, 0, cv.BORDER_DEFAULT);
             //  cv.imshow('canvasOutputx', dstx);
              // cv.imshow('canvasOutputy', dsty);
               cv.convertScaleAbs(dst_v, dst_v, 1, 0);
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


    const [subGradientsTransformationOptions,setSubGradientsTransformationOptions] = useState(<Card>
                                                                                                <Card.Header>
                                                                                                  <Card.Title>Laplacian</Card.Title>
                                                                                                </Card.Header>
                                                                                                <Card.Body>
                                                                                                  <Form.Group className="mb-3">
                                                                                                        <InputGroup className="mb-3">
                                                                                                          <InputGroup.Text id="ksize_x_label_l">Ksize:</InputGroup.Text>
                                                                                                          <Form.Control aria-describedby="ksize_x_label_l" id="ksize_id" type="number" placeholder="1" />
                                                                                                        </InputGroup>
                                                                                                        <InputGroup className="mb-3">
                                                                                                          <InputGroup.Text id="ksize_y_label_l">Scale:</InputGroup.Text>
                                                                                                          <Form.Control aria-describedby="ksize_y_label_l" id="scale_id" type="number" placeholder="1" />
                                                                                                        </InputGroup>
                                                                                                        <InputGroup className="mb-3">
                                                                                                          <InputGroup.Text id="ksize_z_label_l">Delta:</InputGroup.Text>
                                                                                                          <Form.Control aria-describedby="ksize_z_label_l" id="delta_id" type="number" placeholder="0" />
                                                                                                        </InputGroup>
                                                                                                    <Form.Text className="text-muted"> The Kernel Size </Form.Text>
                                                                                                  </Form.Group>
                                                                                                </Card.Body>
                                                                                                <Card.Footer>
                                                                                                  <Button onClick={laplacian}>Laplacian</Button>
                                                                                                </Card.Footer>
                                                                                              </Card>
                                                                                               )


                                                                                               
      const handleSelect = (eventKey) => {
    
        switch(eventKey){
          case "laplacian":
          setSubGradientsTransformationOptions(<Card>
                                                 <Card.Header>
                                                   <Card.Title>Laplacian</Card.Title>
                                                 </Card.Header>
                                                 <Card.Body>
                                                   <Form.Group className="mb-3">
                                                         <InputGroup className="mb-3">
                                                           <InputGroup.Text id="ksize_x_label_l">Ksize:</InputGroup.Text>
                                                           <Form.Control aria-describedby="ksize_x_label_l" id="ksize_id" type="number" placeholder="1" />
                                                         </InputGroup>
                                                         <InputGroup className="mb-3">
                                                           <InputGroup.Text id="ksize_y_label_l">Scale:</InputGroup.Text>
                                                           <Form.Control aria-describedby="ksize_y_label_l" id="scale_id" type="number" placeholder="1" />
                                                         </InputGroup>
                                                         <InputGroup className="mb-3">
                                                           <InputGroup.Text id="ksize_z_label_l">Delta:</InputGroup.Text>
                                                           <Form.Control aria-describedby="ksize_z_label_l" id="delta_id" type="number" placeholder="0" />
                                                         </InputGroup>
                                                     <Form.Text className="text-muted"> The Kernel Size </Form.Text>
                                                   </Form.Group>
                                                 </Card.Body>
                                                 <Card.Footer>
                                                   <Button onClick={laplacian}>Laplacian</Button>
                                                 </Card.Footer>
                                               </Card>
                                               )
          break
          case "sobel":
          setSubGradientsTransformationOptions(<Card>
                                                 <Card.Header>
                                                   <Card.Title>Sobel</Card.Title>
                                                 </Card.Header>
                                                 <Card.Body>
                                                   <Form.Group className="mb-3">
                                                         <InputGroup className="mb-3">
                                                           <InputGroup.Text id="ksize_x_label_s">dx:</InputGroup.Text>
                                                           <Form.Control aria-describedby="ksize_x_label_s" id="dx_id" type="number" placeholder="1" />
                                                         </InputGroup>
                                                         <InputGroup className="mb-3">
                                                           <InputGroup.Text id="ksize_y_label_s">dy:</InputGroup.Text>
                                                           <Form.Control aria-describedby="ksize_y_label_s" id="dy_id" type="number" placeholder="0" />
                                                         </InputGroup>
                                                         <InputGroup className="mb-3">
                                                           <InputGroup.Text id="ksize_z_label_s">Ksize:</InputGroup.Text>
                                                           <Form.Control aria-describedby="ksize_z_label_s" id="ksize_id" type="number" placeholder="3" />
                                                         </InputGroup>
                                                         <InputGroup className="mb-3">
                                                         <InputGroup.Text id="ksize_w_label_s">Scale:</InputGroup.Text>
                                                           <Form.Control aria-describedby="ksize_w_label_s" id="scale_id" type="number" placeholder="1" />
                                                         </InputGroup>
                                                         <InputGroup className="mb-3">
                                                         <InputGroup.Text id="ksize_v_label_s">Delta:</InputGroup.Text>
                                                           <Form.Control aria-describedby="ksize_v_label_s" id="delta_id" type="number" placeholder="0" />
                                                         </InputGroup>
                                                     <Form.Text className="text-muted"> The Kernel Size </Form.Text>
                                                   </Form.Group>
                                                 </Card.Body>
                                                 <Card.Footer>
                                                   <Button onClick={sobel}>Sobel</Button>
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
              <Form.Label>Gradients Transformations</Form.Label>
              <Form.Select
                       // value={subGradients}
                        onChange={e => {
                        //   console.log("e.target.value", e.target.value);
                        //   setSubGradients(e.target.value);
                          handleSelect(e.target.value)
                        }}
              >
                <option value="laplacian">Laplacian</option>
                <option value="sobel">Sobel</option>
              </Form.Select>
            </Form.Group>
          </Card.Header>
          <Card.Body>
              {subGradientsTransformationOptions}
          </Card.Body>
        </Card>
        <div hidden={!show} className="overlay-curtain">
     <div className="loader"></div>
</div>
        </>
    )
}

export default Gradients

// let src = cv.imread('canvasInput');
// let dst = new cv.Mat();
// let ksize = new cv.Size(9, 9);
// // You can try more different parameters
// cv.GaussianBlur(src, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
// cv.imshow('canvasOutput', dst);
// src.delete(); dst.delete();