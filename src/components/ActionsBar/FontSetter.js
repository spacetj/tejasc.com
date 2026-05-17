import injectSheet from "react-jss";
import PropTypes from "prop-types";
import React from "react";

//import { MenuItem, MenuList } from "@material-ui/core/Menu";
import Popper from "@material-ui/core/Popper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import IconButton from "@material-ui/core/IconButton";
import FormatSizeIcon from "@material-ui/icons/FormatSize";

const styles = theme => ({
  fontSizeSetter: {
    [`@media (min-width: ${theme.mediaQueryTresholds.M}px)`]: {}
  },
  open: {
    color: theme.bars.colors.icon
  },
  popper: {
    zIndex: 1
  }
});

class FontSetter extends React.Component {
  state = {
    anchorEl: null,
    open: false
  };

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  handleClick = event => {
    this.setState(state => ({
      anchorEl: event.currentTarget,
      open: !state.open
    }));
  };

  handleClose = () => {
    if (!this.state.open) {
      return;
    }

    this.timeout = setTimeout(() => {
      this.setState({ open: false });
    });
  };

  handleSetting = e => {
    const val = e.target.innerText.replace("%", "");
    const factor = +val / 100;
    this.props.increaseFont(factor);
    this.handleClose();
  };

  render() {
    const { classes } = this.props;
    const { anchorEl, open } = this.state;

    return (
      <nav className={classes.fontSizeSetter}>
        <IconButton
          aria-label="Increase font size"
          aria-owns={open ? "font-menu-list" : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
          title="Change font size"
          className={classes.open}
        >
          <FormatSizeIcon />
        </IconButton>
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="bottom-end"
          transition
          className={classes.popper}
        >
          {({ TransitionProps }) => (
            <ClickAwayListener onClickAway={this.handleClose}>
              <Grow {...TransitionProps} id="font-menu-list" style={{ transformOrigin: "0 0 0" }}>
                <Paper>
                  <MenuList role="menu">
                    <MenuItem onClick={this.handleSetting}>150%</MenuItem>
                    <MenuItem onClick={this.handleSetting}>125%</MenuItem>
                    <MenuItem onClick={this.handleSetting}>100%</MenuItem>
                  </MenuList>
                </Paper>
              </Grow>
            </ClickAwayListener>
          )}
        </Popper>
      </nav>
    );
  }
}

FontSetter.propTypes = {
  classes: PropTypes.object.isRequired,
  increaseFont: PropTypes.func.isRequired
};

export default injectSheet(styles)(FontSetter);
