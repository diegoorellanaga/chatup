import React from 'react'
import SubAppItem from './subAppItem';
import './styleMenu/menu.css'
import Header from './header'

const MenuList = ({subApps}) => {

    return (
        <>
        <Header/>
        <div className="topicList-wrap">

            {subApps.map(subApp => (
             <SubAppItem subApp={subApp} key={subApp.id}/>
            ))}

        </div>
        </>
    )
}

export default MenuList