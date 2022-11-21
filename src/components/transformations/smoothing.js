import {React, useState,useEffect,useCallback} from 'react'
import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import './style/style.css'
var cv = require('opencv.js');

const Smoothing = ({inputCanvasId,inputCanvasIdShow,outputCanvasId,outputCanvasIdShow,setCanDownload}) => {
    

   // const [subSmoothing, setSubSmoothing] = useState("gaussian_blur"); medianBlur
   const [show,setShow] = useState(false)
    
    const gaussianBlur = () => {
      setShow(true)
        let ksize_x = 1;
        let ksize_y = 1;

        if(document.getElementById("ksize_x").value && document.getElementById("ksize_y").value){
         ksize_x = Math.abs(parseInt(document.getElementById("ksize_x").value))%2 == 1 ? Math.abs(parseInt(document.getElementById("ksize_x").value)): Math.abs(parseInt(document.getElementById("ksize_x").value))+1
         ksize_y = Math.abs(parseInt(document.getElementById("ksize_y").value))%2 == 1 ? Math.abs(parseInt(document.getElementById("ksize_y").value)): Math.abs(parseInt(document.getElementById("ksize_y").value))+1
        }else{
          ksize_x = 3
          ksize_y = 3
        }
        document.getElementById("ksize_x").value = ksize_x
        document.getElementById("ksize_y").value = ksize_y

        
        setTimeout(()=>{
        let src = cv.imread(inputCanvasId);
        let dst = new cv.Mat();
        let ksizeCV = new cv.Size(ksize_x,ksize_y);
        // You can try more different parameters
        console.log(ksizeCV,"ksizeCV",1,ksize_x)
        cv.GaussianBlur(src, dst, ksizeCV, 0, 0, cv.BORDER_DEFAULT);
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
    }

    const averaging = () => {
      setShow(true)
      let ksize_x = 1;
      let ksize_y = 1;

      if(document.getElementById("av_ksize_x").value && document.getElementById("av_ksize_y").value){
       ksize_x = Math.abs(parseInt(document.getElementById("av_ksize_x").value))//%2 == 1 ? Math.abs(parseInt(document.getElementById("av_ksize_x").value)): Math.abs(parseInt(document.getElementById("av_ksize_x").value))+1
       ksize_y = Math.abs(parseInt(document.getElementById("av_ksize_y").value))//%2 == 1 ? Math.abs(parseInt(document.getElementById("av_ksize_y").value)): Math.abs(parseInt(document.getElementById("av_ksize_y").value))+1
      }else{
        ksize_x = 3
        ksize_y = 3
      }
      document.getElementById("av_ksize_x").value = ksize_x
      document.getElementById("av_ksize_y").value = ksize_y

      setTimeout(()=>{
      let src = cv.imread(inputCanvasId);
      let dst = new cv.Mat();
      let ksize = new cv.Size(ksize_x, ksize_y);
      let anchor = new cv.Point(-1, -1);
      // You can try more different parameters
      cv.blur(src, dst, ksize, anchor, cv.BORDER_DEFAULT);
      // cv.boxFilter(src, dst, -1, ksize, anchor, true, cv.BORDER_DEFAULT)
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
  }


    const medianBlur = () => {
 
      setShow(true)
      let median = 1
      if(document.getElementById("median_id").value){
       median = Math.abs(parseInt(document.getElementById("median_id").value))%2 == 1 ? Math.abs(parseInt(document.getElementById("median_id").value)): Math.abs(parseInt(document.getElementById("median_id").value))+1
      }else{
        median = 3
      }
      console.log("median: ",parseInt(document.getElementById("median_id").value))
      document.getElementById("median_id").value = median

      setTimeout(()=>{
        let src = cv.imread(inputCanvasId);
        let dst = new cv.Mat();
        // You can try more different parameters
        cv.medianBlur(src, dst, median);
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
     // setShow(false)
    }
    
    const bilateralFilter = () => {
      setShow(true)

      // d − A variable of the type integer representing the diameter of the pixel neighborhood.

      // sigmaColor − A variable of the type integer representing the filter sigma in the color space.
      
      // sigmaSpace − A variable of the type integer representing the filter sigma in the coordinate space.
      let diameter = Math.abs(parseInt(document.getElementById("d_id").value)) ? Math.abs(parseInt(document.getElementById("d_id").value)) : 27
      let sigmaColor = Math.abs(parseInt(document.getElementById("sigmacolor_id").value)) ? Math.abs(parseInt(document.getElementById("sigmacolor_id").value)) : 74
      let sigmaFilter = Math.abs(parseInt(document.getElementById("sigmafilter_id").value)) ? Math.abs(parseInt(document.getElementById("sigmafilter_id").value)) : 74
      document.getElementById("d_id").value = diameter ;  document.getElementById("sigmacolor_id").value = sigmaColor ; document.getElementById("sigmafilter_id").value = sigmaFilter;

      setTimeout(()=>{
      let src = cv.imread(inputCanvasId);
      let dst = new cv.Mat();
      cv.cvtColor(src, src, cv.COLOR_RGBA2RGB, 0);
      // You can try more different parameters
      cv.bilateralFilter(src, dst, diameter, sigmaColor, sigmaFilter, cv.BORDER_DEFAULT);
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
  

      
    }


    const [subSmoothingTransformationOptions,setSubSmoothingTransformationOptions] = useState(<Card>
                                                                                                <Card.Header>
                                                                                                  <Card.Title>Gaussian Blur</Card.Title>
                                                                                                </Card.Header>
                                                                                                <Card.Body>
                                                                                                  <Form.Group className="mb-3">
                                                                                                    <div style={{display: "grid",gridTemplateColumns: "repeat(2, 1fr)"}}>
                                                                                                      <div style={{display:"flex",flexDirection: "column"}}>
                                                                                                        <InputGroup className="mb-3">
                                                                                                          <InputGroup.Text id="ksize_x_label">X:</InputGroup.Text>
                                                                                                          <Form.Control aria-describedby="ksize_x_label" id="ksize_x" type="number" placeholder="3" />
                                                                                                        </InputGroup>
                                                                                                      </div>
                                                                                                      <div style={{display:"flex",flexDirection: "column"}}>
                                                                                                        <InputGroup className="mb-3">
                                                                                                          <InputGroup.Text id="ksize_y_label">Y:</InputGroup.Text>
                                                                                                          <Form.Control aria-describedby="ksize_y_label" id="ksize_y" type="number" placeholder="3" />
                                                                                                        </InputGroup>
                                                                                                      </div>
                                                                                                    </div>
                                                                                                    <Form.Text className="text-muted"> The Kernel Size </Form.Text>
                                                                                                  </Form.Group>
                                                                                                </Card.Body>
                                                                                                <Card.Footer>
                                                                                                  <Button onClick={gaussianBlur}>Gaussian Blur</Button>
                                                                                                </Card.Footer>
                                                                                              </Card>
                                                                                               )


                                                                                               
      const handleSelect = (eventKey) => {
    
        switch(eventKey){
          case "gaussian_blur":
          setSubSmoothingTransformationOptions(<Card>
                                                 <Card.Header>
                                                   <Card.Title>Gaussian Blur</Card.Title>
                                                 </Card.Header>
                                                 <Card.Body>
                                                   <Form.Group className="mb-3">
                                                     <div style={{display: "grid",gridTemplateColumns: "repeat(2, 1fr)"}}>
                                                       <div style={{display:"flex",flexDirection: "column"}}>
                                                         <InputGroup className="mb-3">
                                                           <InputGroup.Text id="ksize_x_label">X:</InputGroup.Text>
                                                           <Form.Control aria-describedby="ksize_x_label" id="ksize_x" type="number" placeholder="3" />
                                                         </InputGroup>
                                                       </div>
                                                       <div style={{display:"flex",flexDirection: "column"}}>
                                                         <InputGroup className="mb-3">
                                                           <InputGroup.Text id="ksize_y_label">Y:</InputGroup.Text>
                                                           <Form.Control aria-describedby="ksize_y_label" id="ksize_y" type="number" placeholder="3" />
                                                         </InputGroup>
                                                       </div>
                                                     </div>
                                                     <Form.Text className="text-muted"> The Kernel Size </Form.Text>
                                                   </Form.Group>
                                                 </Card.Body>
                                                 <Card.Footer>
                                                   <Button onClick={gaussianBlur}>Gaussian Blur</Button>
                                                 </Card.Footer>
                                               </Card>
                                               )
          break
          case "median_blur":
          setSubSmoothingTransformationOptions(<Card>
                                                 <Card.Header>
                                                   <Card.Title>Median Blur</Card.Title>
                                                 </Card.Header>
                                                 <Card.Body>
                                                 <Form.Group className="mb-3">
                                                   <InputGroup className="mb-3">
                                                             <InputGroup.Text id="median_id_label">Median</InputGroup.Text>
                                                             <Form.Control aria-describedby="median_id_label" id="median_id" type="number" placeholder="3" />
                                                   </InputGroup>
                                                   </Form.Group>
                                                 </Card.Body>
                                                 <Card.Footer>
                                                   <Button disabled={show} onClick={medianBlur}>Median Blur</Button>
                                                 </Card.Footer>
                                               </Card>)
          break
          case "bilateral_filter":
          setSubSmoothingTransformationOptions(<Card>
                                                 <Card.Header>
                                                   <Card.Title>Bilateral Filter</Card.Title>
                                                 </Card.Header>
                                                 <Card.Body>
  
                                                   <InputGroup className="mb-3">
                                                             <InputGroup.Text id="d_id_label">d</InputGroup.Text>
                                                             <Form.Control aria-describedby="d_id_label" id="d_id" type="number" placeholder="27" />
                                                   </InputGroup>
                                                   <InputGroup className="mb-3">
                                                             <InputGroup.Text id="SigmaColor_id_label">SigmaColor</InputGroup.Text>
                                                             <Form.Control aria-describedby="SigmaColor_id_label" id="sigmacolor_id" type="number" placeholder="74" />
                                                   </InputGroup>
                                                   <InputGroup className="mb-3">
                                                             <InputGroup.Text id="SigmaFilter_id_label">SigmaFilter</InputGroup.Text>
                                                             <Form.Control aria-describedby="SigmaFilter_id_label" id="sigmafilter_id" type="number" placeholder="74" />
                                                   </InputGroup>
                                                 </Card.Body>
                                                 <Card.Footer>
                                                   <Button onClick={bilateralFilter}>Median Blur</Button>
                                                 </Card.Footer>
                                               </Card>)
          break
          case "averaging":
          setSubSmoothingTransformationOptions(<Card>
                                                 <Card.Header>
                                                   <Card.Title>Averaging</Card.Title>
                                                 </Card.Header>
                                                 <Card.Body>
                                                   <Form.Group className="mb-3">
                                                     <div style={{display: "grid",gridTemplateColumns: "repeat(2, 1fr)"}}>
                                                       <div style={{display:"flex",flexDirection: "column"}}>
                                                         <InputGroup className="mb-3">
                                                           <InputGroup.Text id="av_ksize_x_label">X:</InputGroup.Text>
                                                           <Form.Control aria-describedby="av_ksize_x_label" id="av_ksize_x" type="number" placeholder="3" />
                                                         </InputGroup>
                                                       </div>
                                                       <div style={{display:"flex",flexDirection: "column"}}>
                                                         <InputGroup className="mb-3">
                                                           <InputGroup.Text id="av_ksize_y_label">Y:</InputGroup.Text>
                                                           <Form.Control aria-describedby="av_ksize_y_label" id="av_ksize_y" type="number" placeholder="3" />
                                                         </InputGroup>
                                                       </div>
                                                     </div>
                                                     <Form.Text className="text-muted"> The Kernel Size </Form.Text>
                                                   </Form.Group>
                                                 </Card.Body>
                                                 <Card.Footer>
                                                   <Button onClick={averaging}>Averaging</Button>
                                                 </Card.Footer>
                                               </Card>
                                               )
          break



        }
      };                                                                                           

    return (
        <>
        <Card>
          <Card.Header>
            <Form.Group className="mb-3">
              <Form.Label>Smoothing Transformations</Form.Label>
              <Form.Select
                       // value={subSmoothing}
                        onChange={e => {
                        //   console.log("e.target.value", e.target.value);
                        //   setSubSmoothing(e.target.value);
                          handleSelect(e.target.value)
                        }}
              >
                <option value="gaussian_blur">Gaussian Blur</option>
                <option value="median_blur">Median Blur</option>
                <option value="bilateral_filter">Bilateral Filter</option>
                <option value="averaging">Averaging</option>
              </Form.Select>
            </Form.Group>
          </Card.Header>
          <Card.Body>
              {subSmoothingTransformationOptions}
          </Card.Body>
        </Card>

<div hidden={!show} className="overlay-curtain">
     <div className="loader"></div>
</div>

        </>
    )
}

export default Smoothing

// let src = cv.imread('canvasInput');
// let dst = new cv.Mat();
// let ksize = new cv.Size(9, 9);
// // You can try more different parameters
// cv.GaussianBlur(src, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
// cv.imshow('canvasOutput', dst);
// src.delete(); dst.delete();