import React, { useState, useEffect } from "react";
import axios from "axios";
import PostElement from "./post";
import Card from "react-bootstrap/Card";
//import Form from 'react-bootstrap/Form'
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import ImageGallery from "./imageGallery";

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
//https://ipinfo.io/ http://localhost:3000/blog/1

const Form = ({ pageId, userId, userName, userLastName, userEmail }) => {
  const [inputText, setInputText] = useState({});
  const [inputName, setInputName] = useState({
    text: userName + " " + userLastName[0] + ".",
  });
  const [inputEmail, setInputEmail] = useState({ text: userEmail });
  const [posts, getPosts] = useState([]);
  const [validated, setValidated] = useState(false);
  const [windowsWidth, setWindowsWidth] = useState(window.innerWidth);

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
  const [disableButton, setDisableButton] = useState(false);
  const [triggerChange, setTriggerChange] = useState(0.87);

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
      const url = window.hostUrl + "makepostmath.php"; // 1 !!
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

  useEffect(() => {
    validate();
  }, [inputText, inputName, inputEmail]);

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

  useEffect(() => {
    getAllPosts();
  }, [triggerChange]);

  const getAllPosts = () => {
    console.log("updating chat!!!");
    let formData = new FormData();
    formData.append("pageId", pageId);

    axios
      .post(
        window.hostUrl + "getpostsmath.php", // 2 !!
        formData
      )
      .then((res) => {
        //  console.log(res)
        var sortedData = res.data
          ? res.data.sort((a, b) => parseInt(a.postId) - parseInt(b.postId))
          : [];
        getPosts(sortedData);
        //     console.log(sortedData)
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

  return (
    <div className="App-header" style={{ backgroundColor: "lightYellow" }}>
      <div style={{ width: "90%" ,backgroundColor: "lightYellow" ,overflow:"scroll", maxHeight:"600px"}}>
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
  );
};

export default Form;
