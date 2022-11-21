import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ImageGallery from "./imageGallery";
import PostElement from './post'
import axios from "axios";
import  { useNavigate } from 'react-router-dom'
import Header from '../header'


const Form = ({ pageId}) => {
  const navigate = useNavigate();

  var userIdTemp;

  const checkLogin = ()=>{
    userIdTemp  =  localStorage.getItem("userId")
    //alert(userId)
        if (userIdTemp){
          console.log("already logged in")
        }else{
          navigate("/login");
        } 
  }
  checkLogin()

  const [userId,setUserId] = useState(userIdTemp)
  const [userName,setUserName] = useState(localStorage.getItem("userName"))
  const [userLastName,setUserLastName] = useState(localStorage.getItem("userLastName"))
  const [userEmail,setUserEmail] = useState(localStorage.getItem("userEmail"))

  const [inputName, setInputName] = useState({
    text: userName + " " + userLastName[0] + ".",
  });
  const [inputEmail, setInputEmail] = useState({ text: userEmail });

    const [imageList, setImageList] = useState([
        "1m.jpg",
        "2m.jpg",
        "3m.jpg",
        "4m.jpg",
        "5m.jpg",
        "6m.jpg",
        "7m.jpg",
        "8m.jpg",
        "9m.jpg",
        "10m.jpg",
        "11m.jpg",
        "12m.jpg",
        "13m.jpg",
        "14m.jpg",
        "15m.jpg",
        "16m.jpg",
        "17m.jpg",
        "18m.png",
        "19m.jpg",
        "20m.png",
        "21m.png",
        "22m.png",
        "23m.jpg",
        "24m.png",
      ]);
      const [selectedImage, setSelectedImage] = useState(imageList[7]);
      const [inputText, setInputText] = useState({});
      const [disableButton, setDisableButton] = useState(false);
      const [validated, setValidated] = useState(false);
      const [posts, getPosts] = useState([]);
      const [triggerChange, setTriggerChange] = useState(0.87);
      const [windowsWidth, setWindowsWidth] = useState(window.innerWidth);
      const [postsLength,setpostsLength] = useState(-1)
      const handleAdd = (e) => {
        setInputText({ text: e.target.value });
      };

      const validate = () => {
        if (inputText.text) {
          setValidated(true);
        } else {
          setValidated(false);
        }
      };

    
      const handleSubmit = (e) => {
        console.log(inputText.text)
        e.preventDefault();
        if (validated) {
          setDisableButton(true);
          let formData = new FormData();
          formData.append("post", inputText.text);
          formData.append("name", inputName.text);
          formData.append("pageId", pageId);
          formData.append("email", inputEmail.text);
          formData.append("imageAvatar", selectedImage);
          console.log("selectedImage", selectedImage);
          const url = window.hostUrl + "postposts.php"; // 1 !!
          formData.append("userId", userId); //"123")//resp.data.ipAddress)
          axios
            .post(url, formData)
            .then((res) => {
              getAllPosts();
              setInputText({ text: "" });
              setSelectedImage(imageList[7]);
              document.getElementById("textareamessage_input_main").value = "";
              console.log("main post");
              setDisableButton(false);
            })
            .catch((err) => {
              alert(err);
              setDisableButton(false);
            });
        } else {
        }
      };
      const getAllPosts = () => {
        console.log("updating chat!!!");
        let formData = new FormData();
        formData.append("pageId", pageId);
    
        axios
          .post(
            window.hostUrl + "getposts.php", // 2 !!
            formData
          )
          .then((res) => {
            //  console.log(res)
            var sortedData = res.data
              ? res.data.sort((a, b) => parseInt(a.postId) - parseInt(b.postId))
              : [];
            getPosts(sortedData);

          });
      };

      function createPosts() {
        var colorCount = 0
      return posts.map((rs, index) => {
         // var colorCode = index%2==0 ? "lightblue" : "cyan";
        if (rs.parentPostId == "0") {
          var colorCode = colorCount%2==0 ? "lightblue" : "blue";
          colorCount ++
          var subPostData = posts.filter((post) => {
            return post.parentPostId == rs.postId;
          });
          //     console.log("subPostData",subPostData)
          return (
            <PostElement
              color = {colorCode }
              setTriggerChange={setTriggerChange}
              subPostData={subPostData}
              userId={userId}
              imageAvatar={rs.imageAvatar}
              pageId={pageId}
              key={posts.length + "" + index}
              postContent={rs.post}
              userName={rs.name}
              timeStamp={rs.timeStamp}
              postId={rs.postId}
              activeUserName={inputName.text}
              activeUserEmail={inputEmail.text}
            />
          );
        } else {
          return <></>;
        }
      });
    }

    useEffect(()=>{
      if(posts.length != postsLength){
      var objDiv = document.getElementById("scrollable_div");
      objDiv.scrollTop = objDiv.scrollHeight;
      setpostsLength(posts.length)
      }
    },[posts])


      useEffect(() => {
        validate();
      }, [inputText]);

      useEffect(() => {
        getAllPosts();
      }, [triggerChange]);

      useEffect(() => {



        getAllPosts();
        setWindowsWidth(window.innerWidth);
    
        const myChatInterval = setInterval(() => {



          getAllPosts();
        }, 4000);
    
        return () => {
          clearInterval(myChatInterval);
          console.log("******************* UNMOUNTED");
        };
      }, []);

    return (
      <>
      <Header/>
        <div className="App-header" style={{ backgroundColor: "lightYellow" }}>


       <div id="scrollable_div" style={{ width: "90%" ,backgroundColor: "lightYellow" ,overflow:"scroll", maxHeight:"600px"}}>

       {createPosts()}

       </div> 
       <Card
        bg={validated ? "success" : "warning"}
        key="Secondary"
        text="black"
        style={{ width: "90%" }}

        className="mb-2"
      >
        <Card.Header style={{ fontSize: "20px", fontWeight: "1" }}>
          Post a Message
        </Card.Header>
        <Card.Body>
          <Card.Title style={{ fontSize: "20px", fontWeight: "1" }}>
            <ImageGallery
              imageList={imageList}
              setSelectedImage={setSelectedImage}
            />
          </Card.Title>
          <label
            style={{ fontSize: "20px", fontWeight: "1" }}
            htmlFor="textareamessage_input_main"
          >
            Message
          </label>
          <textarea
            className="form-control mb-2"
            id="textareamessage_input_main"
            rows="5"
            onChange={handleAdd}
          />
          <Button
            disabled={disableButton}
            onClick={handleSubmit}
            className="btn btn-success"
            id="submit"
          >
            SUBMIT
          </Button>
        </Card.Body>
      </Card>

        </div>
        </>
      );

}




export default Form;