import React,{useState, useEffect} from 'react'
import Modal from 'react-bootstrap/Modal'
import SubAppItem from './subAppItem';
import './styleMenu/menu.css'
import Header from './header'
import './imageModifierStyle/mainSectionStyle.css'
import './imageModifierStyle/subSectionStyle.css'
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';
import {CannyEdgeAndContours,Colorspace,Geometric,Gradients,Morphological,Pyramids,Smoothing, Thresholding} from './transformations/index'
import VideoRecorder from './videoHandler/videoRecorder'
import VideoSource from './videoHandler/videoSource'
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
var cv = require('opencv.js');

const ImageModifier = ({subApps}) => {

    var inputCanvasId = "input_canvas"
    var outputCanvasId = "output_canvas"
    var inputCanvasIdShow = "input_canvas_show"
    var outputCanvasIdShow = "output_canvas_show"
    var inputVideoId = "video"
    var outputCanvasVideoId = "canvasOutput"

    const [canDownload,setCanDownload] = useState(false)
    const [image,setImage] = useState('')
    const [canvasModifiedContent,setCanvasModifiedContent] = useState('')
    const [isPilingUp,setIsPilingUp] = useState(false)
    const [transformationOptions,setTransformationOptions] = useState(<Colorspace inputCanvasId={isPilingUp ? outputCanvasId : inputCanvasId} outputCanvasId={outputCanvasId} setCanDownload={setCanDownload}/>)
    const [tabOpen,setTabOpen] = useState("colorspace")
    const [counter,setCounter] = useState(1)
    const [isVideo,setIsVideo] = useState(false)
    const [showMobileModal,setShowMobileModal] = useState(false)
    const [isVideoFromCamera,setIsVideoFromCamera] = useState(true) 
    const [isVideoFromFile,setIsVideoFromFile] = useState(false)
    //setIsVideoFromFile, isVideoFromFile
    // const [canvasWidth,setCanvasWidth] = useState("300px")
    // const [canvasHeight,setCanvasHeight] = useState("300px")
    const [isMobile, setIsMobile] = useState(false)
    const [isVideoStopped, setIsVideoStopped] = useState(true)
    const [sourceActivated,setSourceActivated] = useState(false)

    const handleModalClose = () => setShowMobileModal(false);
    const handleModalShow = () => setShowMobileModal(true);
 
    //choose the screen size 
    const handleResize = () => {
      if (window.innerWidth < 1100) {
          setIsMobile(true)
      } else {
          setIsMobile(false)
      }
    }
    
    // create an event listener
    useEffect(() => {
      window.addEventListener("resize", handleResize)
      handleResize()
    },[])
    
    const downloadImage_old = () =>{
      var canvas = document.getElementById(outputCanvasId)
      var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
      window.location.href=image; // it will save locally
   
     // saveAsPNG(outputCanvasId, "hello.png")
   
   
    }

    function downloadImage(){
      let downloadLink = document.createElement('a');
      downloadLink.setAttribute('download', 'modifiedImage.png');
      let canvas = document.getElementById(outputCanvasId);
      canvas.toBlob(function(blob) {
        let url = URL.createObjectURL(blob);
        downloadLink.setAttribute('href', url);
        downloadLink.click();
      });
  }



    const handleChange = (e)=>{
        // console.log(e.target.files)
        // setImage(e.target.files[0])

        var canvas = document.getElementById(inputCanvasId);
        var reader = new FileReader();
        reader.onload = function(event){
            var img = new Image();
            img.onload = function(){
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img,0,0);
                //new resize 
                let src = cv.imread(inputCanvasId);
                let dst = new cv.Mat();
                let newSize = window.canvasSize
                let dsize = new cv.Size(newSize,parseInt((newSize*src.rows)/src.cols));
                // You can try more different parameters
                cv.resize(src, dst, dsize, 0, 0, cv.INTER_AREA);
                cv.imshow(inputCanvasIdShow, dst);
                cv.imshow(outputCanvasIdShow, dst);
                cv.imshow(outputCanvasId, src);
                src.delete(); dst.delete();
                setCanDownload(true)
                //setCanvasWidth(+"px")

            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(e.target.files[0]);  

    }

    const deleteEffects = ()=>{
      let src = cv.imread(inputCanvasId);
      let dst = new cv.Mat();
      let newSize = window.canvasSize
      let dsize = new cv.Size(newSize,parseInt((newSize*src.rows)/src.cols));
      // You can try more different parameters
      cv.resize(src, dst, dsize, 0, 0, cv.INTER_AREA);
      cv.imshow(inputCanvasIdShow, dst);
      cv.imshow(outputCanvasIdShow, dst);
      cv.imshow(outputCanvasId, src);
    }

    const handleSelect = (eventKey) => {
         
        let currentInput = isPilingUp ? outputCanvasId : inputCanvasId
        let currentInputShow = isPilingUp ? outputCanvasIdShow : inputCanvasIdShow
        setTabOpen(eventKey)
        switch(eventKey){
          case "colorspace":
          setTransformationOptions(<Colorspace  key={1+counter}  inputCanvasId={currentInput} isVideo = {isVideo} outputCanvasId={outputCanvasId} outputCanvasIdShow={outputCanvasIdShow}  setCanDownload={setCanDownload}/>)
          break
          case "geometric":
          setTransformationOptions(<Geometric key={2+counter}  inputCanvasId={currentInput} isVideo = {isVideo} outputCanvasId={outputCanvasId} outputCanvasIdShow={outputCanvasIdShow}  setCanDownload={setCanDownload}/>)
          break
          case "thresholding":
          setTransformationOptions(<Thresholding  key={3+counter}  inputCanvasId={currentInput} isVideo = {isVideo} outputCanvasId={outputCanvasId} outputCanvasIdShow={outputCanvasIdShow}  setCanDownload={setCanDownload}/>)
          break
          case "smoothing":
          setTransformationOptions(<Smoothing  key={4+counter}  inputCanvasId={currentInput} isVideo = {isVideo} outputCanvasId={outputCanvasId} outputCanvasIdShow={outputCanvasIdShow}  setCanDownload={setCanDownload}/>)
          break
          case "morphological":
          setTransformationOptions(<Morphological key={5+counter}  inputCanvasId={currentInput} isVideo = {isVideo} outputCanvasId={outputCanvasId} outputCanvasIdShow={outputCanvasIdShow}  setCanDownload={setCanDownload}/>)
          break
          case "gradients":
          setTransformationOptions(<Gradients key={6+counter}  inputCanvasId={currentInput} isVideo = {isVideo} outputCanvasId={outputCanvasId} outputCanvasIdShow={outputCanvasIdShow}  setCanDownload={setCanDownload}/>)
          break
          case "canny_edge":
          setTransformationOptions(<CannyEdgeAndContours key={7+counter}  inputCanvasId={currentInput} isVideo = {isVideo} outputCanvasId={outputCanvasId} outputCanvasIdShow={outputCanvasIdShow}  setCanDownload={setCanDownload}/>)
          break
          case "pyramids":
          setTransformationOptions(<Pyramids key={8+counter}  inputCanvasId={currentInput} isVideo = {isVideo} outputCanvasId={outputCanvasId} outputCanvasIdShow={outputCanvasIdShow}  setCanDownload={setCanDownload}/>)
          break
        }
      };

      useEffect(()=>{
        setCounter(counter+1)
       
        console.log("changed")
        console.log("use effect: isPilingUp")
      },[isPilingUp,isVideo])

      useEffect(()=>{
        handleSelect(tabOpen)
        console.log("use effect: counter")
      },[counter])

    return (
        <>
        <Header/>
        <Card>
            <Card.Footer>
            <ButtonGroup style={{width:"100%"}}>
            <ToggleButton
            
            id={`radio-image`}
            type="radio"
            variant='outline-danger'
            name="radio"
            value={0}
            checked={isVideo === false}
            onChange={(e) => setIsVideo(false)}
          >
            Image
          </ToggleButton>
          <ToggleButton
          
            id={`radio-video`}
            type="radio"
            variant='outline-danger'
            name="radio"
            value={1}
            checked={isVideo === true}
            onChange={(e) => setIsVideo(true)}
          >
            Video
          </ToggleButton>

          </ButtonGroup>
          
          
            </Card.Footer>
          </Card>
        <div className={!isVideo ? "image-wrap":""}>
          <div hidden={isVideo} className="subImage-wrap">
              <div className="image-wrap">
                <div hidden className="subImage-wrap">
                  <Card>
                    <canvas hidden id={inputCanvasId}></canvas>
                    <canvas id={inputCanvasIdShow}></canvas>
                  </Card>
                </div>
                <div className="subImage-wrap">
                  <Card>
                    <canvas hidden id={outputCanvasId}></canvas>
                    <canvas id={outputCanvasIdShow}></canvas>
                  </Card>
                </div>
              </div>
              <Card>
                <div className="main-options-wrap">
                  <div className="main-options-subwrap">
                    <Form.Control onChange={handleChange} type="file" placeholder="Enter email" />
                  </div>
                  <div className="main-options-subwrap">
                    <Button disabled={!canDownload} onClick={downloadImage}>Download</Button>
                  </div>
                  <div className="main-options-subwrap">
                   <Button disabled={!canDownload} onClick={handleModalShow}>Effect</Button> {/*hidden={!isMobile} disabled={!canDownload} */}
                  </div>
                  <div className="main-options-subwrap">
                   <Button disabled={!canDownload} onClick={deleteEffects}>No Effect</Button> {/*hidden={!isMobile} disabled={!canDownload} */}
                  </div>

                  <div className="main-options-subwrap">
                    <Form.Check onClick={(e)=> { setIsPilingUp(e.target.checked); }} type="checkbox" label={`Keep Changes`} id={`pile_up_checkbox`} />
                  </div>
                </div>
              </Card>
            </div>
            <Card hidden={!isVideo} className="m-3">
          <Card.Body>
            <div >
              <div >
              <canvas className="video-display-canvas"  id={outputCanvasVideoId}  ></canvas>
              </div>
            </div>
            
          </Card.Body>
          <Card.Footer>
          <VideoSource setSourceActivated={setSourceActivated} inputVideoId={inputVideoId} outputCanvasVideoId={outputCanvasVideoId} isVideoStopped={isVideoStopped} handleModalShow={handleModalShow} setIsVideoStopped={setIsVideoStopped} setIsVideoFromCamera={setIsVideoFromCamera} isVideoFromCamera={isVideoFromCamera} setIsVideoFromFile={setIsVideoFromFile} isVideoFromFile={isVideoFromFile}/>
           <VideoRecorder /> 
          {/* { sourceActivated ? <VideoRecorder sourceActivated={sourceActivated}/> : null } */}
            {/* <VideoRecorder/> */}
            </Card.Footer>
        </Card>
        
          <Modal style={{opacity: "0.8"}} show={showMobileModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
        <Modal.Title>Effect</Modal.Title>
      </Modal.Header>
          <div >
              <Card>
                <Nav  fill variant="tabs"  onSelect={handleSelect} defaultActiveKey="colorspace">
                  <Nav.Item >
                    <Nav.Link eventKey="colorspace">Colorspaces</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="geometric">Geometric</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="thresholding">Thresholding</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="smoothing">Smoothing</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="morphological">Morphological</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="gradients">Gradients</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="canny_edge">Canny and Contours</Nav.Link>
                  </Nav.Item>
                  {/* <Nav.Item> ,visibility:,visibility:"hidden",position:"absolute" autoPlay
                    <Nav.Link eventKey="pyramids">Pyramids</Nav.Link>
                  </Nav.Item>                 */}
                </Nav>
              </Card>
            {transformationOptions}
          </div>
          </Modal>
        </div>
        <video style ={{width:"320", height:"240",visibility:"hidden"}} autoPlay id="video"  controls></video>
        <audio id="out" controls muted></audio>
        <video style ={{width:"320", height:"240"}} hidden id="video_record"  controls></video>
        </>
    )
}

export default ImageModifier