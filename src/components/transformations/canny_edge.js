import {React, useState,useEffect,useCallback} from 'react'
import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
//import {cannyEdge,resize} from './utils/allTransformations'
var cv = require('opencv.js');

const CannyEdgeAndContours = ({inputCanvasId,isVideo,outputCanvasId,outputCanvasIdShow,setCanDownload}) => {
    
  const [show,setShow] = useState(false)
   // const [subCannyContour, setSubCannyContour] = useState("gaussian_blur"); medianBlur
    
    const cannyEdge = () => {

      let ksize_x;
      let ksize_y;
      
      let apertureSize_id = "aperture_size_select";
      let L2gradient_id = "gradient_select"
      let ksize_x_id = "ksize_x_id_ce";
      let ksize_y_id = "ksize_y_id_ce";

      let L2gradient = parseInt(document.getElementById(L2gradient_id).value)>0
      let apertureSize = parseInt(document.getElementById(apertureSize_id).value)

      if(document.getElementById(ksize_x_id).value && document.getElementById(ksize_y_id).value){
       ksize_x = parseInt(document.getElementById(ksize_x_id).value)
       ksize_y = parseInt(document.getElementById(ksize_y_id).value)

      }else{
        ksize_x = 50
        ksize_y = 100

      }

      console.log("canny debug",document.getElementById(ksize_x_id).value , document.getElementById(ksize_y_id).value)

      document.getElementById(ksize_x_id).value = ksize_x
      document.getElementById(ksize_y_id).value = ksize_y

      if(!isVideo){

      setShow(true)
        // threshold1	first threshold for the hysteresis procedure.
        // threshold2	second threshold for the hysteresis procedure..
        // apertureSize	aperture size for the Sobel operator.
        // L2gradient	specifies the equation for finding gradient magnitude. If it is True, it uses the equation mentioned above which is more accurate, otherwise it uses this function: Edge_Gradient(G)=|Gx|+|Gy|. 


        setTimeout(()=>{

        let src = cv.imread(inputCanvasId);
        let dst = new cv.Mat();
        cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
        // You can try more different parameters
        cv.Canny(src, dst, ksize_x, ksize_y, apertureSize, L2gradient);
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

    }else{
      let video = document.getElementById('video');
      let src_v = new cv.Mat(video.height, video.width, cv.CV_8UC4);
      let dst_v  = new cv.Mat(video.height, video.width, cv.CV_8UC1);
      let cap = new cv.VideoCapture(video);
      console.log("canny edge inputs",ksize_x,ksize_y)
    
      const FPS = window.FPS;
      window.streaming = false
    
      function processVideo() {
          try {
              if (!window.streaming) {
                  // clean and stop.
                  src_v .delete();
                  dst_v .delete();
                  console.log("Canny Edge Stopped")
                // delete cap;
                  window.activeEffect = false
                  return;
              }
              let begin = Date.now();
              // start processing.
              cap.read(src_v );
              cv.cvtColor(src_v , dst_v , cv.COLOR_RGBA2GRAY);
              cv.Canny(src_v, dst_v, ksize_x, ksize_y, apertureSize, L2gradient);
              cv.imshow('canvasOutput', dst_v );
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

      var waitEffectInterval =  setInterval(() => {
        console.log("canny",window.activeEffect,window.streaming)
        if(!window.activeEffect){
          window.activeEffect = true
          window.streaming = true
         
          setTimeout(processVideo, 1000);
          clearInterval(waitEffectInterval)
        }
        
      }, 10);
    
      // schedule the first one.
     // setTimeout(processVideo, 0);
    }
        setCanDownload(true)

    }

    const contour = () => {

      
        
        let mode;
        let method;
        let isColorRandom;
        let lineType;
        let lineSize;

        let ksize_x;
        let ksize_y;
        
        let ksize_x_id = "ksize_x_id_co";
        let ksize_y_id = "ksize_y_id_co";

        if(document.getElementById(ksize_x_id).value && document.getElementById(ksize_y_id).value){
          ksize_x = parseInt(document.getElementById(ksize_x_id).value)
          ksize_y = parseInt(document.getElementById(ksize_y_id).value)
   
         }else{
           ksize_x = 50
           ksize_y = 200
   
         }
console.log(ksize_x,"ccccccccccccc")


        switch(document.getElementById("mode_select").value){
            case "RETR_CCOMP":
              mode = cv.RETR_CCOMP
            break
            case "RETR_EXTERNAL":
              mode = cv.RETR_EXTERNAL
            break
            case "RETR_LIST":
              mode = cv.RETR_LIST
            break
            case "RETR_TREE":
              mode = cv.RETR_TREE
            break
            case "RETR_FLOODFILL":
              mode = cv.RETR_FLOODFILL
            break       
        }

        switch(document.getElementById("method_select").value){
            case "CHAIN_APPROX_SIMPLE":
            method = cv.CHAIN_APPROX_SIMPLE
            break
            case "CHAIN_APPROX_NONE":
            method = cv.CHAIN_APPROX_NONE
            break
            case "CHAIN_APPROX_TC89_L1":
            method = cv.CHAIN_APPROX_TC89_L1
            break
            case "CHAIN_APPROX_TC89_KCOS":
            method = cv.CHAIN_APPROX_TC89_KCOS
            break    
        }

        switch(document.getElementById("color_select").value){
            case "random":
            isColorRandom = true
            break
            case "single":
            isColorRandom = false
            break
        }
//line_size_select
        switch(document.getElementById("line_select").value){
            case "FILLED":
            lineType = cv.FILLED
            break
            case "LINE_4":
            lineType = cv.LINE_4
            break
            case "LINE_8":
            lineType = cv.LINE_8
            break
            case "LINE_AA":
            lineType = cv.LINE_AA
            break
        }


        lineSize=parseInt(document.getElementById("line_size_select").value)


        if(!isVideo){

          setShow(true)
        setTimeout(()=>{

        let src = cv.imread(inputCanvasId);
        console.log('mat type image image',src.type())
        console.log("size image:",src.rows,src.cols)
        let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
        cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
        cv.threshold(src, src, ksize_x, ksize_y, cv.THRESH_BINARY);
        let contours = new cv.MatVector();
        let hierarchy = new cv.Mat();
        // You can try more different parameters
        cv.findContours(src, contours, hierarchy, mode, method);
        // draw contours with random Scalar
        for (let i = 0; i < contours.size(); ++i) {
            let color;
            if(isColorRandom){
              color = new cv.Scalar(Math.round(Math.random() * 255), Math.round(Math.random() * 255),
                                      Math.round(Math.random() * 255));
            }else{
              color = new cv.Scalar(255, 255, 255)  
            }
            cv.drawContours(dst, contours, i, color, lineSize, lineType, hierarchy, 100);
        }
        cv.imshow(outputCanvasId, dst);
        src.delete(); dst.delete(); contours.delete(); hierarchy.delete();

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
      let src_v = new cv.Mat(video.height, video.width, cv.CV_8UC4); //CV_8UC4
      let src_v_c = new cv.Mat(video.height, video.width, cv.CV_8UC4); //CV_8UC4
      let dst_v  = new cv.Mat(video.height, video.width, cv.CV_8UC3);

      let contours_v = new cv.MatVector();
      let hierarchy_v = new cv.Mat();
      let color = new cv.Scalar(255, 255, 255)
      let cap = new cv.VideoCapture(video);
    
    
      const FPS = 10;
      window.streaming = false
    
      function processVideo() {
          try {
              if (!window.streaming) {
                  // clean and stop.
                  src_v .delete();
                  dst_v .delete();
                  contours_v.delete();
                  hierarchy_v.delete();
             //    delete cap;
                  window.activeEffect = false
                  console.log("Contour Stopped")
                  return;
              }
              let begin = Date.now();
              // start processing.
              dst_v.setTo([0,0,0,0]);//dst_v =cv.Mat.zeros(video.height, video.width, cv.CV_8UC3); //leak!!
              cap.read(src_v);
              cv.cvtColor(src_v, src_v_c, cv.COLOR_RGBA2GRAY, 0);
              cv.threshold(src_v_c, src_v_c, ksize_x, ksize_y, cv.THRESH_BINARY);
              cv.findContours(src_v_c, contours_v, hierarchy_v, mode, method);
              for (let i = 0; i < contours_v.size(); ++i) {
                //  let color;
                  if(isColorRandom){
                    color[0]=Math.round(Math.random() * 255)
                    color[1]=Math.round(Math.random() * 255)
                    color[2]=Math.round(Math.random() * 255)
                  }else{
                    color[0]=255
                    color[1]=255
                    color[2]=255
                  }
                  cv.drawContours(dst_v, contours_v, i, color, lineSize, lineType, hierarchy_v, 100);
              }
              cv.imshow('canvasOutput', dst_v );
              let delay = 1000 / FPS - (Date.now() - begin);
              setTimeout(processVideo, delay);
          } catch (err) {
              //utils.printError(err);
              console.log(err)
          }
      };
    
      // schedule the first one.
     // setTimeout(processVideo, 0);

     var waitEffectInterval =  setInterval(() => {

      console.log("contour",window.activeEffect,window.streaming)
      if(!window.activeEffect){
        window.activeEffect = true
        window.streaming = true
        setTimeout(processVideo, 1000);
        clearInterval(waitEffectInterval)
      }
      
    }, 10);





  }
      
  }

  const nothing = () => {

    if(!isVideo){

      setShow(true)
        // threshold1	first threshold for the hysteresis procedure.
        // threshold2	second threshold for the hysteresis procedure..
        // apertureSize	aperture size for the Sobel operator.
        // L2gradient	specifies the equation for finding gradient magnitude. If it is True, it uses the equation mentioned above which is more accurate, otherwise it uses this function: Edge_Gradient(G)=|Gx|+|Gy|. 


        setTimeout(()=>{

        let src = cv.imread(inputCanvasId);

        cv.imshow(outputCanvasId, src);
        src.delete(); 

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

    }else{
      let video = document.getElementById('video');
      let src_v = new cv.Mat(video.height, video.width, cv.CV_8UC4);
      let dst_v  = new cv.Mat(video.height, video.width, cv.CV_8UC1);
      let cap = new cv.VideoCapture(video);
  
      const FPS = window.FPS;
      window.streaming = false
    
      function processVideo() {
          try {
              if (!window.streaming) {
                  // clean and stop.
                  src_v .delete();
                  dst_v .delete();
                  console.log("Canny Edge Stopped")
                // delete cap;
                  window.activeEffect = false
                  return;
              }
              let begin = Date.now();
              // start processing.
              cap.read(src_v );
              cv.imshow('canvasOutput', src_v );
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

      var waitEffectInterval =  setInterval(() => {
        console.log("canny",window.activeEffect,window.streaming)
        if(!window.activeEffect){
          window.activeEffect = true
          window.streaming = true
         
          setTimeout(processVideo, 1000);
          clearInterval(waitEffectInterval)
        }
        
      }, 10);
    
      // schedule the first one.
     // setTimeout(processVideo, 0);
    }
        setCanDownload(true)

    

  }

    const [subCannyContourTransformationOptions,setSubCannyContourTransformationOptions] = useState(<Card>
                                                                                                <Card.Header>
                                                                                                  <Card.Title>Canny Edge</Card.Title>
                                                                                                </Card.Header>
                                                                                                <Card.Body>
                                                                                                  <Form.Group className="mb-3">
                                                                                                  <Form.Text className="text-muted"> The Kernel Size </Form.Text>
                                                                                                    <div style={{display: "grid",gridTemplateColumns: "repeat(2, 1fr)"}}>
                                                                                                      <div style={{display:"flex",flexDirection: "column"}}>
                                                                                                        <InputGroup className="mb-3">
                                                                                                          <InputGroup.Text id="ksize_x_label_ce">Th1:</InputGroup.Text>
                                                                                                          <Form.Control aria-describedby="ksize_x_label_ce" id="ksize_x_id_ce" type="number" placeholder="50" />
                                                                                                        </InputGroup>
                                                                                                      </div>
                                                                                                      <div style={{display:"flex",flexDirection: "column"}}>
                                                                                                        <InputGroup className="mb-3">
                                                                                                          <InputGroup.Text id="ksize_y_label_ce">Th2:</InputGroup.Text>
                                                                                                          <Form.Control aria-describedby="ksize_y_label_ce" id="ksize_y_id_ce" type="number" placeholder="100" />
                                                                                                        </InputGroup>
                                                                                                      </div>
                                                                                                    </div>
                                                                                                    <Form.Group className="mb-3">
                                                                                                      <Form.Label>Aperture Size</Form.Label>
                                                                                                      <Form.Select id="aperture_size_select">
                                                                                                        <option value="3">3</option>
                                                                                                        <option value="5">5</option>
                                                                                                        <option value="7">7</option>
                                                                                                      </Form.Select>
                                                                                                    </Form.Group>
                                                                                                    <Form.Group className="mb-3">
                                                                                                      <Form.Label>L2 Gradient</Form.Label>
                                                                                                      <Form.Select id="gradient_select">
                                                                                                        <option value="0">False</option>
                                                                                                        <option value="1">True</option>
                                                                                                      </Form.Select>
                                                                                                    </Form.Group>
                                                                                                  </Form.Group>
                                                                                                </Card.Body>
                                                                                                <Card.Footer>
                                                                                                  <Button onClick={cannyEdge}>Canny Edge</Button>
                                                                                                </Card.Footer>
                                                                                              </Card>
                                                                                               )
    

                                                                                               
      const handleSelect = (eventKey) => {
    
        switch(eventKey){
          case "canny":
          setSubCannyContourTransformationOptions(<Card>
                                                     <Card.Header>
                                                       <Card.Title>Canny Edge</Card.Title>
                                                     </Card.Header>
                                                     <Card.Body>
                                                       <Form.Group className="mb-3">
                                                       <Form.Text className="text-muted"> The Kernel Size </Form.Text>
                                                         <div style={{display: "grid",gridTemplateColumns: "repeat(2, 1fr)"}}>
                                                           <div style={{display:"flex",flexDirection: "column"}}>
                                                             <InputGroup className="mb-3">
                                                               <InputGroup.Text id="ksize_x_label_ce">Th1:</InputGroup.Text>
                                                               <Form.Control aria-describedby="ksize_x_label_ce" id="ksize_x_id_ce" type="number" placeholder="50" />
                                                             </InputGroup>
                                                           </div>
                                                           <div style={{display:"flex",flexDirection: "column"}}>
                                                             <InputGroup className="mb-3">
                                                               <InputGroup.Text id="ksize_y_label_ce">Th2:</InputGroup.Text>
                                                               <Form.Control aria-describedby="ksize_y_label_ce" id="ksize_y_id_ce" type="number" placeholder="100" />
                                                             </InputGroup>
                                                           </div>
                                                         </div>
                                                         <Form.Group className="mb-3">
                                                           <Form.Label>Aperture Size</Form.Label>
                                                           <Form.Select id="aperture_size_select">
                                                             <option value="3">3</option>
                                                             <option value="5">5</option>
                                                             <option value="7">7</option>
                                                           </Form.Select>
                                                         </Form.Group>
                                                         <Form.Group className="mb-3">
                                                           <Form.Label>L2 Gradient</Form.Label>
                                                           <Form.Select id="gradient_select">
                                                             <option value="0">False</option>
                                                             <option value="1">True</option>
                                                           </Form.Select>
                                                         </Form.Group>
                                                       </Form.Group>
                                                     </Card.Body>
                                                     <Card.Footer>
                                                       <Button onClick={cannyEdge}>Canny Edge</Button>
                                                     </Card.Footer>
                                                   </Card>
                                                    )
          break
          case "contour":
          setSubCannyContourTransformationOptions(<Card>
                                                     <Card.Header>
                                                       <Card.Title>Contour</Card.Title>
                                                     </Card.Header>
                                                     <Card.Body>
                                                     <Form.Group className="mb-3">
                                                           <Form.Label>Mode</Form.Label>
                                                           <Form.Select id="mode_select">
                                                             <option value="RETR_CCOMP">RETR_CCOMP</option>
                                                             <option value="RETR_EXTERNAL">RETR_EXTERNAL</option>
                                                             <option value="RETR_LIST">RETR_LIST</option>
                                                             <option value="RETR_TREE">RETR_TREE</option>
                                                             {/* <option value="RETR_FLOODFILL">RETR_FLOODFILL</option> */}
                                                           </Form.Select>
                                                         </Form.Group>
                                                         <Form.Group className="mb-3">
                                                           <Form.Label>Method</Form.Label>
                                                           <Form.Select id="method_select">
                                                             <option value="CHAIN_APPROX_SIMPLE">CHAIN_APPROX_SIMPLE</option>
                                                             <option value="CHAIN_APPROX_NONE">CHAIN_APPROX_NONE</option>
                                                             <option value="CHAIN_APPROX_TC89_L1">CHAIN_APPROX_TC89_L1</option>
                                                             <option value="CHAIN_APPROX_TC89_KCOS">CHAIN_APPROX_TC89_KCOS</option>
                                                           </Form.Select>
                                                         </Form.Group>
                                                         <Form.Group className="mb-3">
                                                           <Form.Label>Color</Form.Label>
                                                           <Form.Select id="color_select">
                                                             <option value="random">Random</option>
                                                             <option value="single">One</option>
                                                           </Form.Select>
                                                         </Form.Group>
                                                         <Form.Group className="mb-3">
                                                           <Form.Label>Line Option</Form.Label>
                                                           <Form.Select id="line_select">
                                                             {/* <option value="FILLED">FILLED</option> */}
                                                             <option value="LINE_4">LINE_4</option>
                                                             <option value="LINE_8">LINE_8</option>
                                                             <option value="LINE_AA">LINE_AA</option>
                                                           </Form.Select>
                                                         </Form.Group>
                                                         <Form.Group className="mb-3">
                                                           <Form.Label>Line Size Option</Form.Label>
                                                           <Form.Select id="line_size_select">
                                                             {/* <option value="FILLED">FILLED</option> */}
                                                             <option value="1">1</option>
                                                             <option value="2">2</option>
                                                             <option value="3">3</option>
                                                             <option value="4">4</option>
                                                             <option value="5">5</option>
                                                             <option value="-1">Filled</option>
                                                           </Form.Select>
                                                           <Form.Label>Threshold</Form.Label>
                                                           <div style={{display: "grid",gridTemplateColumns: "repeat(2, 1fr)"}}>
                                                              <div style={{display:"flex",flexDirection: "column"}}>
                                                                <InputGroup className="mb-3">
                                                                  <InputGroup.Text id="ksize_x_label_co">Th1:</InputGroup.Text>
                                                                  <Form.Control aria-describedby="ksize_x_label_co" id="ksize_x_id_co" type="number" placeholder="120" />
                                                                </InputGroup>
                                                              </div>
                                                              <div style={{display:"flex",flexDirection: "column"}}>
                                                                <InputGroup className="mb-3">
                                                                  <InputGroup.Text id="ksize_y_label_co">Th2:</InputGroup.Text>
                                                                  <Form.Control aria-describedby="ksize_y_label_co" id="ksize_y_id_co" type="number" placeholder="200" />
                                                                </InputGroup>
                                                              </div>
                                                            </div>
                                                         </Form.Group>               
                                                     </Card.Body>
                                                     <Card.Footer>
                                                       <Button onClick={contour}>Contour</Button>
                                                     </Card.Footer>
                                                   </Card>)
          break
          case "nothing":
          setSubCannyContourTransformationOptions(<Card>
                                                     <Card.Header>
                                                       <Card.Title>Contour</Card.Title>
                                                     </Card.Header>
                                                     <Card.Body>
                                                         No effect
                                                     </Card.Body>
                                                     <Card.Footer>
                                                       <Button onClick={nothing}>No Effect</Button>
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
              <Form.Label>Canny and Contour Transformations</Form.Label>
              <Form.Select
                       // value={subCannyContour}
                        onChange={e => {
                        //   console.log("e.target.value", e.target.value);
                        //   setSubCannyContour(e.target.value);
                          handleSelect(e.target.value)
                        }}
              >
                <option value="canny">Canny Edge</option>
                <option value="contour">Contour</option>
                <option value="nothing">No Effect</option>
              </Form.Select>
            </Form.Group>
          </Card.Header>
          <Card.Body>
              {subCannyContourTransformationOptions}
          </Card.Body>
        </Card>
        <div hidden={!show} className="overlay-curtain">
          <div className="loader"></div>
        </div>
        </>
    )
}

export default CannyEdgeAndContours

// let src = cv.imread('canvasInput');  CannyContour Gradient
// let dst = new cv.Mat();
// let ksize = new cv.Size(9, 9);
// // You can try more different parameters
// cv.GaussianBlur(src, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
// cv.imshow('canvasOutput', dst);
// src.delete(); dst.delete();