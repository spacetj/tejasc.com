import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import injectSheet from 'react-jss';

const styles = theme => ({
  topMenu: {
    float: "right",
    margin: "5px 10px 0 0",
    [`@media (min-width: ${theme.mediaQueryTresholds.M}px)`]: {}
  },
  open: {
    color: theme.bars.colors.icon
  },
  popper: {
    zIndex: 1
  }
});

class TopMenu extends React.Component {
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

  render() {
    const { classes, pages } = this.props;
    const { anchorEl, open } = this.state;

    return (
      <nav className={classes.topMenu}>
        <IconButton
          aria-label="More"
          aria-owns={open ? "menu-list" : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
          className={classes.open}
        >
          <MoreVertIcon />
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
              <Grow {...TransitionProps} id="menu-list" style={{ transformOrigin: "0 0 0" }}>
                <Paper>
                  <MenuList role="menu">
                    <MenuItem
                      onClick={e => {
                        this.props.homeLinkOnClick(e);
                        this.handleClose();
                      }}
                    >
                      Home
                    </MenuItem>
                    {pages.map((page, i) => {
                      const { fields, frontmatter } = page.node;

                      return (
                        <Link key={fields.slug} to={fields.slug} style={{ display: "block" }}>
                          <MenuItem
                            onClick={e => {
                              this.props.pageLinkOnClick(e);
                              this.handleClose();
                            }}
                          >
                            {frontmatter.menuTitle ? frontmatter.menuTitle : frontmatter.title}
                          </MenuItem>
                        </Link>
                      );
                    })}
                    <Link to="/contact/" style={{ display: "block" }}>
                      <MenuItem
                        onClick={e => {
                          this.props.pageLinkOnClick(e);
                          this.handleClose();
                        }}
                      >
                        Contact
                      </MenuItem>
                    </Link>
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

TopMenu.propTypes = {
  pages: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  pageLinkOnClick: PropTypes.func.isRequired,
  homeLinkOnClick: PropTypes.func.isRequired
};

export default injectSheet(styles)(TopMenu);
