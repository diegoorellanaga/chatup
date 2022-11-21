import React from 'react'
import './styleMenu/submenu.css'
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
const TopicItem = ({subApp:{id,description,title,createdAt,category,cover, color}}) => {
    return (
        <div  className="topicItem-wrap">
            <Link style={{textDecoration: "none"}} className='topicItemv-link' to={`/${category}`}>
            <Card>
            <Card.Header>{title}</Card.Header>
            <Card.Body>
                <img className='topic-topicItem-cover' src={cover} alt="cover" />
                </Card.Body>
                </Card>
            </Link>
        </div>
    )
}

export default TopicItem