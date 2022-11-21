import {React, useState} from 'react'
import { Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
var cv = require('opencv.js');

const Geometric = ({inputCanvasId,isVideo,outputCanvasId,outputCanvasIdShow,setCanDownload}) => {


  const [show,setShow] = useState(false)


    const rotateImage = () => {
      
     var degrees_id = "degrees_id"   
     var direction_id = "direction_id"   

     var degrees=   parseFloat(document.getElementById(degrees_id).value)
     var direction = parseFloat(document.getElementById(direction_id).value)

     if(degrees){
        document.getElementById(degrees_id).value = degrees
     }else{
        degrees=1
        document.getElementById(degrees_id).value = degrees
     }

     if(direction){
        document.getElementById(direction_id).value = direction
     }else{
        direction=1
        document.getElementById(direction_id).value = direction
     }


      if(!isVideo){
      setShow(true)

      setTimeout(()=>{
        console.log(inputCanvasId,outputCanvasId)
                let src = cv.imread(inputCanvasId);
                let dst = new cv.Mat();
                let dsize = new cv.Size(src.cols, src.rows);
                console.log("d size",src.rows, src.cols,"center",src.cols / 2, src.rows / 2)
                let center = new cv.Point(src.cols / 2, src.rows / 2);
                // You can try more different parameters
                let M = cv.getRotationMatrix2D(center, degrees, 1);
                cv.warpAffine(src, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
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
                let dst_v = new cv.Mat(video.height, video.width, cv.CV_8UC1);
                let cap = new cv.VideoCapture(video);
                let rotation = 0
                        let dsize = new cv.Size(src_v.cols, src_v.rows);
                        let center = new cv.Point(src_v.cols / 2, src_v.rows / 2);
                let M = cv.getRotationMatrix2D(center, rotation, 1);
                
                console.log(M.data)
                let scalar = new cv.Scalar()
                let final_rot = 0
                let zoom = 0
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
                      zoom = zoom + direction
                      rotation = rotation + degrees
                      final_rot=45*Math.cos(rotation*0.01)
                      let begin = Date.now();
                      // start processing.
                      cap.read(src_v);
                      //let dsize = new cv.Size(src_v.rows, src_v.cols);
                     // let center = new cv.Point(src_v.cols / 2, src_v.rows / 2);
                       // You can try more different parameters
                     // let M = cv.getRotationMatrix2D(center, rotation, 1);
                      cv.warpAffine(src_v, dst_v, cv.getRotationMatrix2D(center, final_rot, 0.25*Math.cos(zoom*0.01)+1), dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, scalar);
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



    const setHumanSkin=() =>{
        document.getElementById("ksize_x").value = 161
        document.getElementById("ksize_y").value = 102
        document.getElementById("ksize_z").value = 94
        document.getElementById("ksize_w").value = 0  //236, 188, 180

        document.getElementById("ksize_xu").value = 236
        document.getElementById("ksize_yu").value = 188
        document.getElementById("ksize_zu").value = 180
        document.getElementById("ksize_wu").value = 255
    }        

    const setHumanSkin2=() =>{ //	rgb(89, 47, 42)
        document.getElementById("ksize_x").value = 80
        document.getElementById("ksize_y").value = 47
        document.getElementById("ksize_z").value = 42
        document.getElementById("ksize_w").value = 0  //236, 188, 180

        document.getElementById("ksize_xu").value = 236
        document.getElementById("ksize_yu").value = 188
        document.getElementById("ksize_zu").value = 180
        document.getElementById("ksize_wu").value = 255
    }  
    
    const setSkyColorRange=() =>{ //	32,99,165
        document.getElementById("ksize_x").value = 32
        document.getElementById("ksize_y").value = 99
        document.getElementById("ksize_z").value = 165
        document.getElementById("ksize_w").value = 0  //236, 188, 180

        document.getElementById("ksize_xu").value = 185
        document.getElementById("ksize_yu").value = 235
        document.getElementById("ksize_zu").value = 255
        document.getElementById("ksize_wu").value = 255
    }    

    const inRange = () => {
      

        let ksize_x = 0;
        let ksize_y = 0;
        let ksize_z = 0;
        let ksize_w = 0;

        let ksize_xu = 0;
        let ksize_yu = 0;
        let ksize_zu = 0;
        let ksize_wu = 0;



        if(document.getElementById("ksize_x").value && document.getElementById("ksize_y").value && document.getElementById("ksize_z").value && document.getElementById("ksize_w").value && document.getElementById("ksize_xu").value && document.getElementById("ksize_yu").value && document.getElementById("ksize_zu").value && document.getElementById("ksize_wu").value){
            ksize_x = Math.abs(parseInt(document.getElementById("ksize_x").value))//%2 == 1 ? Math.abs(parseInt(document.getElementById("ksize_x").value)): Math.abs(parseInt(document.getElementById("ksize_x").value))+1
            ksize_y = Math.abs(parseInt(document.getElementById("ksize_y").value))//%2 == 1 ? Math.abs(parseInt(document.getElementById("ksize_y").value)): Math.abs(parseInt(document.getElementById("ksize_y").value))+1
            ksize_z = Math.abs(parseInt(document.getElementById("ksize_z").value))//%2 == 1 ? Math.abs(parseInt(document.getElementById("ksize_x").value)): Math.abs(parseInt(document.getElementById("ksize_x").value))+1
            ksize_w = Math.abs(parseInt(document.getElementById("ksize_w").value))//%2 == 1 ? Math.abs(parseInt(document.getElementById("ksize_y").value)): Math.abs(parseInt(document.getElementById("ksize_y").value))+1
   
            ksize_xu = Math.abs(parseInt(document.getElementById("ksize_xu").value))//%2 == 1 ? Math.abs(parseInt(document.getElementById("ksize_x").value)): Math.abs(parseInt(document.getElementById("ksize_x").value))+1
            ksize_yu = Math.abs(parseInt(document.getElementById("ksize_yu").value))//%2 == 1 ? Math.abs(parseInt(document.getElementById("ksize_y").value)): Math.abs(parseInt(document.getElementById("ksize_y").value))+1
            ksize_zu = Math.abs(parseInt(document.getElementById("ksize_zu").value))//%2 == 1 ? Math.abs(parseInt(document.getElementById("ksize_x").value)): Math.abs(parseInt(document.getElementById("ksize_x").value))+1
            ksize_wu = Math.abs(parseInt(document.getElementById("ksize_wu").value))//%2 == 1 ? Math.abs(parseInt(document.getElementById("ksize_y").value)): Math.abs(parseInt(document.getElementById("ksize_y").value))+1
   


        }else{
          ksize_x = 0
          ksize_y = 0
          ksize_z = 0
          ksize_w = 0

          ksize_xu = 150
          ksize_yu = 150
          ksize_zu = 150
          ksize_wu = 255


        }
        document.getElementById("ksize_x").value = ksize_x
        document.getElementById("ksize_y").value = ksize_y
        document.getElementById("ksize_z").value = ksize_z
        document.getElementById("ksize_w").value = ksize_w

        document.getElementById("ksize_xu").value = ksize_xu
        document.getElementById("ksize_yu").value = ksize_yu
        document.getElementById("ksize_zu").value = ksize_zu
        document.getElementById("ksize_wu").value = ksize_wu


        if(!isVideo){

        setShow(true)
        setTimeout(()=>{
        let src = cv.imread(inputCanvasId);
        let dst = new cv.Mat();
        let low = new cv.Mat(src.rows, src.cols, src.type(), [ksize_x, ksize_y, ksize_z, ksize_w]);
        let high = new cv.Mat(src.rows, src.cols, src.type(), [ksize_xu, ksize_yu, ksize_zu, ksize_wu]);
        // You can try more different parameters
        cv.inRange(src, low, high, dst);
        cv.imshow(outputCanvasId, dst);
        src.delete(); dst.delete(); low.delete(); high.delete();

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
                let dst_v = new cv.Mat();
                let dsize = new cv.Size(src_v.rows, src_v.cols);
                // (data32F[0], data32F[1]) is the first point
                // (data32F[2], data32F[3]) is the sescond point
                // (data32F[4], data32F[5]) is the third point
                // (data32F[6], data32F[7]) is the fourth point
               // let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [56, 65, 368, 52, 28, 387, 389, 390]);
               // let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, 600, 0, 0, 300, 300, 300]);
               // let M = cv.getPerspectiveTransform(srcTri, dstTri);
                // You can try more different parameters
                //cv.warpPerspective(src, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());


             //   let video = document.getElementById('video');
            //    let src_v = new cv.Mat(video.height, video.width, cv.CV_8UC4);
              //  let dst_v  = new cv.Mat(video.height, video.width, cv.CV_8UC1);
                let cap = new cv.VideoCapture(video);
                let low = new cv.Mat(src_v.rows, src_v.cols, src_v.type(), [ksize_x, ksize_y, ksize_z, ksize_w]);
                let high = new cv.Mat(src_v.rows, src_v.cols, src_v.type(), [ksize_xu, ksize_yu, ksize_zu, ksize_wu]);
              
                const FPS =window.FPS;
                window.streaming = false

                var a_1 = parseInt(Math.random()*10+1)
                var a_2 = parseInt(Math.random()*10+1)
                var a_3 = parseInt(Math.random()*10+1)
                var a_4 = parseInt(Math.random()*10+1)
                var a_5 = parseInt(Math.random()*10+1)
                var a_6 = parseInt(Math.random()*10+1)
                var a_7 = parseInt(Math.random()*10+1)
                var a_8 = parseInt(Math.random()*10+1)
                var b_1 = parseInt(Math.random()*100)
                var b_2 = parseInt(Math.random()*100)
                var b_3 = parseInt(Math.random()*100)
                var b_4 = parseInt(Math.random()*100)
                var b_5 = parseInt(Math.random()*100)
                var b_6 = parseInt(Math.random()*100)
                var b_7 = parseInt(Math.random()*100)
                var b_8 = parseInt(Math.random()*100)
                var scaleFactor = 80


                var distorter = 0
              
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
                        distorter = distorter + 0.01
                        // start processing.
                        cap.read(src_v );
                        let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [56, 65, 368, 52, 28, 387, 389, 390]);
                        let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2,[56+scaleFactor*Math.cos(a_1*distorter+b_2), 65+scaleFactor*Math.cos(a_2*distorter+b_3), 368+scaleFactor*Math.cos(a_3*distorter+b_4), 52+scaleFactor*Math.cos(a_5*distorter+b_5), 28+scaleFactor*Math.cos(a_4*distorter+b_6), 387+scaleFactor*Math.cos(a_7*distorter+b_7), 389+scaleFactor*Math.cos(a_8*distorter+b_8), 390+scaleFactor*Math.cos(a_1*distorter+b_1)])//[110*Math.cos(distorter+b_1)**2,110*Math.cos(distorter+b_2)**2,100*Math.cos(distorter+b_3)**2,110*Math.cos(distorter+b_4)**2,110*Math.cos(distorter+b_5)**2,100*Math.cos(distorter+b_6)**2,100*Math.cos(distorter+b_7)**2,100*Math.cos(distorter+b_8)**2]);
                        let M = cv.getPerspectiveTransform(srcTri, dstTri);
                        // You can try more different parameters
                        cv.warpPerspective(src_v, dst_v, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
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




    const [subColorspaceTransformationOptions,setSubColorspaceTransformationOptions] = useState(<Card>
                                                                                                  <Card.Header>
                                                                                                    <Card.Title>Gray Scale</Card.Title>
                                                                                                  </Card.Header>
                                                                                                  <Card.Body>

                                                                                                    <Form.Group className="mb-3">
                                                                                                                 <InputGroup className="mb-3">
                                                                                                                   <InputGroup.Text id="degrees_id_label">Degrees:</InputGroup.Text>
                                                                                                                   <Form.Control aria-describedby="degrees_id_label" id="degrees_id" type="number" placeholder="1" />
                                                                                                                 </InputGroup>
                                                                                                                 <InputGroup className="mb-3">
                                                                                                                   <InputGroup.Text id="direction_id_label">Direction:</InputGroup.Text>
                                                                                                                   <Form.Control aria-describedby="direction_id_label" id="direction_id" type="number" placeholder="1" />
                                                                                                                 </InputGroup>
                                                                                                                 <InputGroup className="mb-3">
                                                                                                                   <InputGroup.Text id="ksize_z_label_l_func">Function:</InputGroup.Text>
                                                                                                                   <Form.Control aria-describedby="ksize_z_label_l_func" id="delta_id_func" type="number" placeholder="0" />
                                                                                                                 </InputGroup>
                                                                                                             <Form.Text className="text-muted"> Something</Form.Text>
                                                                                                           </Form.Group>
                                                                                                    
                                                                                                    </Card.Body>
                                                                                                  <Card.Footer>
                                                                                                    <Button onClick={rotateImage}>Gray Scale</Button>
                                                                                                  </Card.Footer>
                                                                                                </Card>
                                                                                                 )
    

const handleSelect = (eventKey) => {
   switch(eventKey){
     case "rotate":
     setSubColorspaceTransformationOptions(<Card>
                                            <Card.Header>
                                              <Card.Title>Gray Scale</Card.Title>
                                            </Card.Header>
                                            <Card.Body>
                                              <Form.Group className="mb-3">
                                                <InputGroup className="mb-3">
                                                  <InputGroup.Text id="degrees_id_label">Degrees:</InputGroup.Text>
                                                  <Form.Control aria-describedby="degrees_id_label" id="degrees_id" type="number" placeholder="1" />
                                                </InputGroup>
                                                <InputGroup className="mb-3">
                                                  <InputGroup.Text id="direction_id_label">Direction:</InputGroup.Text>
                                                  <Form.Control aria-describedby="direction_id_label" id="direction_id" type="number" placeholder="1" />
                                                </InputGroup>
                                                <InputGroup className="mb-3">
                                                  <InputGroup.Text id="ksize_z_label_l_func">Function:</InputGroup.Text>
                                                  <Form.Control aria-describedby="ksize_z_label_l_func" id="delta_id_func" type="number" placeholder="0" />
                                                </InputGroup>
                                                  <Form.Text className="text-muted"> Something </Form.Text>
                                              </Form.Group>

                                            </Card.Body>
                                            <Card.Footer>
                                              <Button onClick={rotateImage}>Gray Scale</Button>
                                            </Card.Footer>
                                          </Card>
                                          )
     break
     case "in_range":
     setSubColorspaceTransformationOptions(<Card>
                                             <Card.Header>
                                               <Card.Title>In Range</Card.Title>
                                             </Card.Header>
                                             <Card.Body>

                                               <Form.Group className="mb-3">
                                               <Form.Text className="text-muted"> Lower Limit </Form.Text>
                                                 <div style={{display: "grid",gridTemplateColumns: "repeat(4, 1fr)"}}>
                                                   <div style={{display:"flex",flexDirection: "column"}}>
                                                     <InputGroup className="mb-3">
                                                       <InputGroup.Text id="ksize_x_label">X:</InputGroup.Text>
                                                       <Form.Control aria-describedby="ksize_x_label" id="ksize_x" type="number" placeholder="0" />
                                                     </InputGroup>
                                                   </div>
                                                   <div style={{display:"flex",flexDirection: "column"}}>
                                                     <InputGroup className="mb-3">
                                                       <InputGroup.Text id="ksize_y_label">Y:</InputGroup.Text>
                                                       <Form.Control aria-describedby="ksize_y_label" id="ksize_y" type="number" placeholder="0" />
                                                     </InputGroup>
                                                   </div>
                                                   <div style={{display:"flex",flexDirection: "column"}}>
                                                     <InputGroup className="mb-3">
                                                       <InputGroup.Text id="ksize_z_label">Z:</InputGroup.Text>
                                                       <Form.Control aria-describedby="ksize_z_label" id="ksize_z" type="number" placeholder="0" />
                                                     </InputGroup>
                                                   </div>
                                                   <div style={{display:"flex",flexDirection: "column"}}>
                                                     <InputGroup className="mb-3">
                                                       <InputGroup.Text id="ksize_w_label">W:</InputGroup.Text>
                                                       <Form.Control aria-describedby="ksize_w_label" id="ksize_w" type="number" placeholder="0" />
                                                     </InputGroup>
                                                   </div>
                                                 </div>
                                                 <Form.Text className="text-muted"> Upper Limit </Form.Text>
                                                 <div style={{display: "grid",gridTemplateColumns: "repeat(4, 1fr)"}}>
                                                   <div style={{display:"flex",flexDirection: "column"}}>
                                                     <InputGroup className="mb-3">
                                                       <InputGroup.Text id="ksize_xu_label">X:</InputGroup.Text>
                                                       <Form.Control aria-describedby="ksize_x_label" id="ksize_xu" type="number" placeholder="150" />
                                                     </InputGroup>
                                                   </div>
                                                   <div style={{display:"flex",flexDirection: "column"}}>
                                                     <InputGroup className="mb-3">
                                                       <InputGroup.Text id="ksize_yu_label">Y:</InputGroup.Text>
                                                       <Form.Control aria-describedby="ksize_yu_label" id="ksize_yu" type="number" placeholder="150" />
                                                     </InputGroup>
                                                   </div>
                                                   <div style={{display:"flex",flexDirection: "column"}}>
                                                     <InputGroup className="mb-3">
                                                       <InputGroup.Text id="ksize_zu_label">Z:</InputGroup.Text>
                                                       <Form.Control aria-describedby="ksize_zu_label" id="ksize_zu" type="number" placeholder="150" />
                                                     </InputGroup>
                                                   </div>
                                                   <div style={{display:"flex",flexDirection: "column"}}>
                                                     <InputGroup className="mb-3">
                                                       <InputGroup.Text id="ksize_wu_label">W:</InputGroup.Text>
                                                       <Form.Control aria-describedby="ksize_wu_label" id="ksize_wu" type="number" placeholder="255" />
                                                     </InputGroup>
                                                   </div>
                                                 </div>
                                                
                                                 <br></br>
                                                 <ButtonGroup aria-label="Basic example">
                                                   <Button onClick={setHumanSkin} variant="secondary">Human Skin</Button>
                                                   <Button onClick={setHumanSkin2} variant="secondary">Human Skin 2</Button>
                                                   <Button onClick={setSkyColorRange} variant="secondary">Sky</Button>
                                                 </ButtonGroup>
                                               </Form.Group>
                                             </Card.Body>
                                             <Card.Footer>
                                               <Button onClick={inRange}>In Range</Button>
                                             </Card.Footer>
                                           </Card>)

     break
   }
}

    return (
        <>
        <Card>
          <Card.Header>
            <Form.Group className="mb-3">
              <Form.Label>Colorspace Transformations</Form.Label>
              <Form.Select
                       // value={subSmoothing}
                        onChange={e => {
                        //   console.log("e.target.value", e.target.value);
                        //   setSubSmoothing(e.target.value);
                          handleSelect(e.target.value)
                        }}
              >
                <option value="rotate">Rotate</option>
                <option value="in_range">In Range</option>

              </Form.Select>
            </Form.Group>
          </Card.Header>
          <Card.Body>
              {subColorspaceTransformationOptions}
          </Card.Body>
        </Card>
        <div hidden={!show} className="overlay-curtain">
         <div className="loader"></div>
        </div>

        </>
    )
}

export default Geometric