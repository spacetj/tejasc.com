import React from "react";
import PropTypes from "prop-types";
import injectSheet from "react-jss";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import IconButton from "@material-ui/core/IconButton";
import Popper from "@material-ui/core/Popper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import FilterListIcon from "@material-ui/icons/FilterList";

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

class CategoryFilter extends React.Component {
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

  handleFiltering = e => {
    const category = e.target.innerText.trim();
    this.props.filterCategory(category);
    this.handleClose();
  };

  render() {
    const { classes, categories } = this.props;
    const { anchorEl, open } = this.state;

    return (
      <nav className={classes.fontSizeSetter}>
        <IconButton
          aria-label="Filter by category"
          aria-haspopup="true"
          onClick={this.handleClick}
          title="Filter the list by category"
          className={classes.open}
        >
          <FilterListIcon />
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
              <Grow {...TransitionProps} id="cat-menu-list" style={{ transformOrigin: "0 0 0" }}>
                <Paper>
                  <MenuList role="menu">
                    <MenuItem key="all" onClick={this.handleFiltering}>
                      all posts
                    </MenuItem>
                    {categories.map(category => (
                      <MenuItem key={category} onClick={this.handleFiltering}>
                        {category}
                      </MenuItem>
                    ))}
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

CategoryFilter.propTypes = {
  classes: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  filterCategory: PropTypes.func.isRequired
};

export default injectSheet(styles)(CategoryFilter);
