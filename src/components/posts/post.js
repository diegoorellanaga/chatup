import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./styles/postStyle.css";
import SubPostElement from "./subPost";
import ImageGallery from "./imageGallery";

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const PostElement = ({
  setTriggerChange,
  subPostData,
  imageAvatar,
  postContent,
  userName,
  timeStamp,
  postId,
  pageId,
  userId,
  activeUserName,
  activeUserEmail,
  color
}) => {
  const [subPosts, setSubPosts] = useState(subPostData);
  const [viewModal, setViewModal] = useState(false);
  const [inputText, setInputText] = useState({});
  const [inputName, setInputName] = useState({ text: activeUserName });
  const [inputEmail, setInputEmail] = useState({ text: activeUserEmail });
  //    const [posts, getPosts] = useState([]);
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

  const handleAdd = (e) => {
    setInputText({ text: e.target.value });
  };

  const validate = () => {
    if (inputText.text) {
      setValidated(true);
      console.log("success vvalidation");
    } else {
      setValidated(false);
      //  console.log("failed validation",validateEmail(inputEmail))
    }
    //  console.log("validation")
  };

  useEffect(() => {
    // getAllSubPosts();
    setWindowsWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    validate();
  }, [inputText, inputName, inputEmail]);

  const ShowModal = () => {
    setViewModal(true);
  };

  const handleClose = () => {
    setViewModal(false);
  };

  const handleSubmitReply = (e) => {
    e.preventDefault();

    if (validated) {
      setDisableButton(true);
      let formData = new FormData();
      formData.append("post", inputText.text);
      formData.append("name", inputName.text);
      formData.append("pageId", pageId);
      formData.append("email", inputEmail.text);
      formData.append("parentPostId", postId);
      formData.append("imageAvatar", selectedImage);
      const url = window.hostUrl + "makepostmath.php"; // 3 !!

      //console.log(resp.data);
      formData.append("userId", userId); //"123")//resp.data.ipAddress)
      axios
        .post(url, formData)
        .then((res) => {
          // getAllSubPosts()
          handleClose();
          setInputText({ text: "" });
          setInputEmail({ text: "" });
          setInputName({ text: "" });
          setSelectedImage(imageList[0]);
          setDisableButton(false);
          setTriggerChange(Math.random());
        })
        .catch((err) => {
          alert(err);
          setDisableButton(false);
        });
    } else {
    }
  };

  function createSubPosts() {
    return subPosts.map((rs, index) => (
      <SubPostElement
        imageAvatar={rs.imageAvatar}
        key={index}
        postContent={rs.post}
        userName={rs.name}
        timeStamp={rs.timeStamp}
      />
    ));
  }
  return (
    <Card
      //bg="secondary"
      // key="Secondary"
      text="white"
      style={{ width: "100%" ,backgroundColor:color}}
      className="mb-2"
    >
      <Card.Header
        style={{
          padding: "0.1rem 1rem",
          paddingBottom: "2rem",
          fontSize: "20px",
          fontWeight: "1",
        }}
      >
        <Image
          style={{maxWidth: "3rem", marginRight: "2%" }}
          className=" rounded-circle img-fluid" //img-fluid
          variant="top"
          src={window.chatImagesURL + imageAvatar}
        />
       
{userName}
       
        
      </Card.Header>
      <Card.Body>
        {/* <Card.Title>some topic </Card.Title> */}
        <Card.Text style={{ whiteSpace: "pre-line" }}>{postContent}</Card.Text>
      </Card.Body>
      {createSubPosts()}
      <Card.Footer
        style={{
          color: "white",
          height: "2.5rem",
          verticalAlign: "text-top",
          padding: "0.1rem 1rem",
          paddingBottom: "3rem",
        }}
      >
        <Button onClick={ShowModal} className="btn btn-success" id="submit">
          REPLY
        </Button>
        <small
          style={{ fontSize: "15px", marginLeft: "2rem", color: "white" }}
          className=""
        >
          {timeStamp}
        </small>
      </Card.Footer>

      <Modal show={viewModal} onHide={handleClose}>
        <Card
          bg={validated ? "success" : "light"}
          key={postId}
          text="black"
          style={{ width: "100%" }}
          //  className="mb-2"
        >
          <Card.Header style={{ fontSize: "20px", fontWeight: "1" }}>
            Post a Reply Message
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
              htmlFor="textareamessage"
            >
              Message
            </label>
            <textarea
              className="form-control mb-2"
              id="textareamessage"
              rows="5"
              onChange={handleAdd}
            />
            <Button
              disabled={disableButton}
              onClick={handleSubmitReply}
              className="btn btn-success"
              id="submitReply"
            >
              REPLY
            </Button>
          </Card.Body>
        </Card>
      </Modal>
    </Card>
  );
};

export default PostElement;
