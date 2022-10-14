 <?php
header("Access-Control-Allow-Origin: *");
$servername = "127.0.0.1";
$username = "root";
$password = "12345";
$dbname = "test_database";
$conn = mysqli_connect($servername,$username,$password,$dbname);
//$query = "INSERT INTO posts (Name,post) VALUES('Diego','test text text')";
$illegalChar = array("'");
$recPost  = str_replace($illegalChar, "", $_POST['post']);
//$recPost = $_POST['post'];
$recName = $_POST['name'];
$recPageId = $_POST['pageId'];
$recUserId = $_POST['userId'];
$recEmail = $_POST['email'];
$recParentPostId = !empty($_POST['parentPostId']) ? $_POST['parentPostId']: 0; 
$recTimeStamp = date("Y-m-d-H-i-s",time());
$recImageAvatar = !empty($_POST['imageAvatar']) ? $_POST['imageAvatar']: "image4.webp";

//$query = "INSERT INTO posts_test (name,post,pageId,userId,lat,lon,country,email) VALUES('dieg11o','asdas',1,'1.asd.a',1.4,1.4,'usa','sdfs@gmal.cm')";

if (!empty($recPost)) {
  $query = "INSERT INTO posts_test (name,post,pageId,userId,email,timeStamp,parentPostId, imageAvatar) VALUES('$recName','$recPost','$recPageId','$recUserId','$recEmail','$recTimeStamp','$recParentPostId','$recImageAvatar')";
  if(mysqli_query($conn,$query)){
      echo "Data INSERTED";
  }
  else{
      echo "Error!";
      echo mysqli_error($conn);
  }

echo "Data 11 has been inserted successfully";
}
