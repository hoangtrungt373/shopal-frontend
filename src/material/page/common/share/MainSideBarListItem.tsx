import * as React from "react";
import {useEffect, useState} from "react";
import {Menu, MenuItem, Sidebar, SubMenu} from "react-pro-sidebar";
import {Box} from "@mui/material";
import './MainSideBarListItem.scss'
import {NavLink, useLocation} from "react-router-dom";
import PageSpinner from "./PageSpinner";

export interface SideBarListItem {
    title: string,
    url?: string,
    icon?: any,
    subItems?: SideBarListItem[],
    active?: boolean
}

interface Props {
    items: SideBarListItem[]
}


export const MainSideBarListItem: React.FC<Props> = ({items}) => {

    const location = useLocation();
    const [activeItem, setActiveItem] = useState<string>(null);
    const [currentItem, setCurrentItem] = useState<string>(null);
    const [isShow, setIsShow] = useState<boolean>(false);

    useEffect(() => {
        items.forEach(item => item.active = false);
        let currentPath = location.pathname;
        items.forEach(item => {
            if (isHaveSubItems(item)) {
                if (item.subItems.find(subItem => currentPath.startsWith(subItem.url) && currentPath[subItem.url.length + 1] != "/") != undefined) {
                    setCurrentItem(item.title);
                    setActiveItem(item.title)
                    return;
                }
            } else {
                if (currentPath.startsWith(item.url) && currentPath[item.url.length] != "/") {
                    setCurrentItem(item.title);
                    setActiveItem(item.title)
                    return;
                }
            }
        })
        setIsShow(true);
    }, [location])

    const isHaveSubItems = (item: SideBarListItem) => {
        return item.subItems != undefined && item.subItems.length > 0
    }

    const isCurrentItem = (item: SideBarListItem) => {
        return item.title == currentItem;
    }

    if (isShow) {
        return (
            <React.Fragment>
                <div style={{display: "flex"}}>
                    <Sidebar className="admin-main-list-item">
                        <Menu className={"menu"}>
                            {
                                items.map((item, index1) => {

                                    if (isHaveSubItems(item)) {
                                        return (
                                            <SubMenu label={item.title} icon={item.icon} key={index1}
                                                     style={{borderLeft: isCurrentItem(item) ? "5px solid #88AAF3" : "5px solid transparent"}}
                                                     className={isCurrentItem(item) ? "menu-item active" : "menu-item"}
                                                     open={item.title == activeItem}
                                                     onClick={() => setActiveItem(activeItem != item.title ? item.title : null)}>
                                                <Box className={"sub-menu"}>
                                                    {
                                                        item.subItems.map((subItem, index2) => (
                                                            <MenuItem className={"sub-menu-item"} key={index2}
                                                                      component={<NavLink activeClassName="selected"
                                                                                          exact
                                                                                          to={subItem.url}/>}>{subItem.title}</MenuItem>
                                                        ))
                                                    }
                                                </Box>
                                            </SubMenu>
                                        )
                                    } else {
                                        return (
                                            <MenuItem icon={item.icon} key={index1}
                                                      style={{borderLeft: isCurrentItem(item) ? "5px solid #88AAF3" : "5px solid transparent"}}
                                                      className={isCurrentItem(item) ? "menu-item active" : "menu-item"}
                                                      component={<NavLink activeClassName="selected"
                                                                          exact to={item.url}/>}>{item.title}
                                            </MenuItem>
                                        )
                                    }
                                })
                            }
                        </Menu>
                    </Sidebar>
                </div>
            </React.Fragment>
        )
    } else {
        return (
            <PageSpinner/>
        )
    }

};