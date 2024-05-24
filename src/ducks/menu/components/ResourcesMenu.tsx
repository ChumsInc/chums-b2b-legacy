import React, {useId} from 'react';
import {useSelector} from "react-redux";
import {selectResourcesMenu} from "../../menu";
import Menu from "@mui/material/Menu";
import NavItemButton from "./NavItemButton";
import MenuItemRouterLink from "./MenuItemRouterLink";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";

const itemStyle: SxProps<Theme> = {
    textTransform: 'uppercase',
    fontWeight: 700,
}

export default function ResourcesMenu() {
    const menu = useSelector(selectResourcesMenu);
    const mediaLg = useMediaQuery('(min-width: 1200px)');
    const buttonId = useId();
    const menuId = useId();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <NavItemButton id={buttonId}
                           sx={{height: '100%'}}
                           aria-label="Products"
                           aria-controls={open ? menuId : undefined}
                           aria-expanded={open ? 'true' : undefined}
                           aria-haspopup="true"
                           onClick={handleClick}>
                Resources
            </NavItemButton>
            <Menu id={menuId}
                  open={open} onClose={handleClose}
                  anchorEl={anchorEl}
                  MenuListProps={{'aria-labelledby': buttonId}}
                  sx={{
                      '& .MuiMenu-list': {
                          display: 'flex',
                          flexDirection: 'column',
                          flexWrap: 'wrap',
                          justifyContent: 'flex-start',
                          color: '#000000'
                      },

                  }}
                  slotProps={{
                      paper: {
                          style: {
                              maxHeight: '75vh',
                              width: mediaLg ? 'fit-content' : '75vw',
                              maxWidth: '100vw',
                          },

                      }
                  }}
            >
                {menu?.items?.map(item => (
                    <div key={item.id}>
                        <MenuItemRouterLink to={item.url} onClick={handleClose}
                                            sx={itemStyle}>
                            {item.title}
                        </MenuItemRouterLink>
                        {!!item.menu && (
                            <Box component="ul" sx={{padding: 0}}>
                                {item.menu?.items?.map(subItem => (
                                    <MenuItemRouterLink key={subItem.id} to={subItem.url}
                                                        onClick={handleClose}>
                                        {subItem.title}
                                    </MenuItemRouterLink>
                                ))}
                            </Box>
                        )}
                    </div>
                ))}
            </Menu>
        </>
    )
}
