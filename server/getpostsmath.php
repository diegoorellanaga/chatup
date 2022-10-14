<?php
header("Access-Control-Allow-Origin: *");
$host = "localhost"; 
$user = "root"; 
$password = "12345"; 
$dbname = "test_database"; 
$id = '';
 
$con = mysqli_connect($host, $user, $password,$dbname);
  
if (!$con) {
  die("Connection failed: " . mysqli_connect_error());
}
 
$pageId = $_POST["pageId"];

//$sql = "SELECT * from posts_test WHERE pageId =" .$pageId." AND parentPostId = 0"; 
$sql = "SELECT * from posts_test WHERE pageId =" .$pageId.""; 

// run SQL statement
$result = mysqli_query($con,$sql);
 
if($result){
  http_response_code(200);
    if (!$id) echo '[';
    for ($i=0 ; $i<mysqli_num_rows($result) ; $i++) {
      echo ($i>0?',':'').json_encode(mysqli_fetch_object($result));
    }
    if (!$id) echo ']';



  //echo json_encode(array("message" => "test","errorId" => "2","data" =>  $result,"data2" =>  $query));
}else{
    http_response_code(400);
    echo json_encode(array("message" => "Unable to fetch data.","errorId" => "2","postinfo"=>$_POST["pageId"],"data" =>  $result,"data2" =>  $sql));
  }

