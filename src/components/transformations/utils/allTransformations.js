

var cv = require('opencv.js');



// export function sum(a, b) {
//     return a + b;
//   }
  
//   // 👇️ named export
// export function multiply(a, b) {
//     return a * b;
//   }
  
  // (arrow function)
  // export const sum = (a, b) => {
  //   return a + b;
  // };

//   export function cannyEdge(src,dst,ksize_x,ksize_y) {
//   //let src = cv.imread(inputCanvasId);
//   //let dst = new cv.Mat();
//   cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
//   // You can try more different parameters
//   cv.Canny(src, dst, ksize_x, ksize_y, apertureSize, L2gradient);
//   }
  
  export function cannyEdge(allData){//src,dst,ksize_x,ksize_y, apertureSize, L2gradient) {
    //let src = cv.imread(inputCanvasId);
    //let dst = new cv.Mat();
    cv.cvtColor(allData.src, allData.src, cv.COLOR_RGB2GRAY, 0);
    // You can try more different parameters
    cv.Canny(allData.src, allData.dst, allData.ksize_x, allData.ksize_y, allData.apertureSize, allData.L2gradient);
    }

    // cv.imshow(outputCanvasId, dst);
    // src.delete(); dst.delete();

    export function resize(allDataResize) {

        let newSize1 = window.canvasSize
        let dsize1 = new cv.Size(newSize1,parseInt((newSize1*allDataResize.src.rows)/allDataResize.src.cols));
        // You can try more different parameters
        cv.resize(allDataResize.src, allDataResize.dst, dsize1, 0, 0, cv.INTER_AREA);
        }



//   let src1 = cv.imread(outputCanvasId);
//   let dst1 = new cv.Mat();

//   cv.imshow(outputCanvasIdShow, dst1);
//   src1.delete(); dst1.delete();  


  