import React, { useState } from 'react'
import clsx from 'clsx'
import Drawer from '@material-ui/core/Drawer'
import Blockies from 'react-blockies'
import List from '@material-ui/core/List'
import DashboardRoundedIcon from '@material-ui/icons/DashboardRounded';
import CopyToClipboard from 'react-copy-to-clipboard'
import { PulseSpinner } from 'react-spinners-kit'
import { Link } from 'react-router-dom'
import Badge from '@material-ui/core/Badge'
import ListItem from '@material-ui/core/ListItem'
import Tooltip from '@material-ui/core/Tooltip'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MuiMenu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton';
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
// import RandomBlockie from './RandomRoomIcon'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import AddBoxRoundedIcon from '@material-ui/icons/AddBoxRounded';
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { drawerWidth } from '../config/constants'

import * as interfaceActions from '../actions/interface/interface.actions'
import * as authActions from '../actions/auth/auth.actions'

const actions = {
    ...interfaceActions,
    ...authActions,
}

const Menu = props => {
    const {
        current_room,
        classes,
        drawerOpen: open,
        openMenu,
        rooms,
        leaveRoom,
        fetching_rooms,
        closeMenu,
        openJoinDialog,
    } = props

    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuRightClick = e => {
        if (e.type === 'contextmenu') {
            e.preventDefault()
            setAnchorEl(e.currentTarget)
        }
    }

    const handleContextMenuClose = () => {
        setAnchorEl(null)
    }

    const handleCopyLink = () => {
        interfaceActions.showMessage("Copied to cliboard!") 
        setAnchorEl(null)
    }

    const handleLeaveRoom = () => {
        setAnchorEl(null)
    }

    const roomIcon = (room_name, room_data) => {
        return (
            <div
                key={room_name}
            >
                <ListItem
                onContextMenu={handleMenuRightClick}
                    style={{
                        color: "#aaa"
                    }}
                    alt={room_name}
                    button
                    classes={{
                        selected: classes.selected
                    }}
                    dense
                    selected={room_name === current_room}
                    component={Link}
                    to={`/synapse/${room_name}`}
                    >
                    <ListItemIcon>
                        <Tooltip
                            disableFocusListener
                            disableTouchListener
                            title={room_name}
                            placement="right-end"
                        >
                        <Badge
                            color="primary"
                            classes={{
                                badge: classes.badgeDefault,
                                colorPrimary: classes.badgeColor
                            }}
                            badgeContent={room_data.unread}
                            >
                        <Blockies seed={room_name} scale={3} />
                        </Badge>
                        </Tooltip>
                    </ListItemIcon>
                    <ListItemText>{room_name}</ListItemText>
                </ListItem>
            <MuiMenu
                id="room-sidebar-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleContextMenuClose}
            >
                <CopyToClipboard text={`${process.env.REACT_APP_LINK_ROOT}/synapse/${room_name}`}>
                    <MenuItem onClick={() => {
                        handleCopyLink()
                    }}>Copy Invite Link</MenuItem>
                </CopyToClipboard>
                <MenuItem onClick={() => {
                    handleLeaveRoom()
                    leaveRoom(room_name)
                }}>Leave Synapse</MenuItem>
            </MuiMenu>
            </div>
        )
    }

    return (
        <Drawer
            className={clsx(classes.drawer, {
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
            })}
            classes={{
                paper: clsx({
                    [classes.drawerPaper]: true,
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                }),
            }}
            variant="permanent"
            open={true}>
            <div
                style={{
                    width: drawerWidth,
                    backgroundColor: "#222",
                    height: "100%",
                }}
            >
                <div
                    style={{
                        width: open ? drawerWidth : 65,
                        transition: '0.2s'
                    }}
                    className={classes.menuTopDiv}
                >
                    <IconButton
                        onClick={open ? closeMenu : openMenu}
                        edge="start"
                        className={classes.chevron}
                        color="inherit"
                        aria-label="menu">
                        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <div style={{ color: "gainsboro" }}>
                    <div>
                        <List>
                            <ListItem
                                style={{
                                    color: "#aaa"
                                }}
                                component={Link}
                                to="/"
                                dense
                                button
                                key={`00000001`}>
                                <ListItemIcon>
                                    <DashboardRoundedIcon style={{ color: "#777" }} />
                                </ListItemIcon>
                                <ListItemText>Index</ListItemText>
                            </ListItem>
                            <ListItem
                                style={{
                                    color: "#aaa"
                                }}
                                onClick={openJoinDialog}
                                dense
                                button
                                key={`00000002`}>
                                <ListItemIcon>
                                    <AddBoxRoundedIcon style={{ color: "#777" }} />
                                </ListItemIcon>
                                <ListItemText>Join Synapse</ListItemText>
                            </ListItem>
                            {
                                fetching_rooms &&
                                <ListItem
                                    style={{
                                        color: "#aaa"
                                    }}
                                    dense
                                    key={1}>
                                    <ListItemIcon>
                                        <PulseSpinner 
                                            color="#69f0ae"
                                            size={24} />
                                    </ListItemIcon>
                                    <ListItemText>Getting rooms...</ListItemText>
                                </ListItem>
                            }
                            {Object.keys(rooms).map(r => roomIcon(r, rooms[r]))}
                        </List>
                    </div>
                </div>
            </div>
        </Drawer>
    )
}

const styles = theme => ({
    badgeDefault: {
        padding: "0px !important",
        border: "1px solid #222",
    },
    chevron: {
        color: "#666",
        '&:hover': {
            color: '#00e676'
        },
        transition: '0.2s'
    },
    menuTopDiv: {
        display: 'flex',
        justifyContent: "center",
        height: 48,
        transition: '0.2s'
    },
    badgeColor: {
        backgroundColor: "#29b6f6",
        color: "#222",
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        '&::-webkit-scrollbar': {
            display: 'none !important'
        },
    },
    joinedRooms: {
        '&::-webkit-scrollbar': {
            display: 'none !important'
        },
    },
    drawerPaper: {
        overflowX: 'hidden',
        backgroundColor: "#222 !important",
        borderColor: "#282828 !important",
        '&::-webkit-scrollbar': {
            display: 'none !important'
        },
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(7) + 1,
        },
    },
    selected: {
        backgroundColor: "#333 !important"
    }
})

const mapStateToProps = state => {
    return {
        drawerOpen: state.interface.drawerOpen,
        rooms: state.auth.room_list,
        fetching_rooms: state.auth.fetching_rooms,
        current_room: state.room.room_name,
    }
}


export default connect(mapStateToProps, actions)(withStyles(styles)(Menu))