import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";

const SubPostElement = ({postContent,userName,timeStamp,imageAvatar}) => {



    return (
        <Card
        bg="light"
        text="black"
        style={{ width: "88%", marginLeft: "10%", marginRight: "2%" }}
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
            style={{float:"left", maxWidth: "3rem", marginRight: "2%" }}
            className="img-fluid rounded-circle"
            variant="top"
            src={window.chatImagesURL + imageAvatar}
          />
          <span style={{float:"left"}}>
          {userName}
          </span>
          <small
            style={{
              fontSize: "15px",
              position: "absolute",
              right: "1%",
              top: "4%",
            }}
            className="text-muted"
          >
            {timeStamp}
          </small>
        </Card.Header>
        <Card.Body>
          {/* <Card.Title>some topic </Card.Title> */}
          <Card.Text style={{ whiteSpace: "pre-line" }}>{postContent}</Card.Text>
        </Card.Body>
      </Card>
      );

}




export default SubPostElement;