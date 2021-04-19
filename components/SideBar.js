import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Collapse from '@material-ui/core/Collapse';
import { useStyles } from '../utils/styles';
import Router from 'next/router';
import NextLink from 'next/link';
import { Typography } from '@material-ui/core';

function SidebarSubCategory({
  depthStep = 10,
  depth = 1,
  expanded,
  category,
  subcategory,
  ...rest
}) {
  const classes = useStyles();
  const [collapsed, setCollapsed] = React.useState(true);

  function toggleCollapse() {
    setCollapsed((prevValue) => !prevValue);
  }

  function onClick(e) {
    if (Array.isArray(category)) {
      toggleCollapse();
    }
    if (category.onClick) {
      category.onClick(e, category);
    }
  }

  let expandIcon;

  if (Array.isArray(category.subcategories) && category.length) {
    expandIcon = !collapsed ? (
      <ExpandLessIcon className={classes.expandArrow + classes.arrowExpanded} />
    ) : (
      <ExpandMoreIcon className={classes.expandArrow} />
    );
  }

  return (
    <>
      <ListItem
        className={classes.sidebarCategory}
        onClick={onClick}
        button
        dense
        {...rest}
      >
        <div style={{ paddingLeft: 20 }} className={classes.sideBarContent}>
          <NextLink
            href={`/search?query=${subcategory.name.split(' ').join('+')}`}
          >
            <div className={classes.sideBarText}>
              <Typography variant="body2">{subcategory.name}</Typography>
            </div>
          </NextLink>
        </div>
        {expandIcon}
      </ListItem>

      <Collapse in={!collapsed} timeout="auto" unmountOnExit>
        {subcategory ? (
          <List disablePadding dense>
            <React.Fragment key={`${subcategory.name}`}>
              {subcategory === 'divider' ? (
                <Divider style={{ margin: '6px 0' }} />
              ) : (
                <SidebarSubCategory
                  depth={depth + 3}
                  depthStep={depthStep + 3}
                  subcategory={subcategory}
                />
              )}
            </React.Fragment>
          </List>
        ) : null}
      </Collapse>
    </>
  );
}

function SidebarCategory({
  depthStep = 10,
  depth = 0,
  expanded,
  category,
  ...rest
}) {
  const classes = useStyles();
  const [collapsed, setCollapsed] = React.useState(true);
  const { categories } = category;

  function toggleCollapse() {
    setCollapsed((prevValue) => !prevValue);
  }

  function onClick(e) {
    if (Array.isArray(category.categories)) {
      toggleCollapse();
    }
    if (category.onClick) {
      category.onClick(e, category);
    }
  }

  let expandIcon;

  if (Array.isArray(categories) && categories.length) {
    expandIcon = !collapsed ? (
      <ExpandLessIcon className={classes.expandArrow + classes.arrowExpanded} />
    ) : (
      <ExpandMoreIcon className={classes.expandArrow} />
    );
  }

  return (
    <>
      <ListItem
        className={classes.sidebarCategory}
        onClick={onClick}
        button
        dense
        {...rest}
      >
        <div
          style={{ paddingLeft: depth * depthStep }}
          className={classes.sideBarContent}
        >
          <NextLink
            href={`/search?category=${category.name.split(' ').join('+')}`}
          >
            <div className={classes.sideBarText}>{category.name}</div>
          </NextLink>
        </div>
        {expandIcon}
      </ListItem>

      <Collapse in={!collapsed} timeout="auto" unmountOnExit>
        {Array.isArray(categories) ? (
          <>
            <List disablePadding dense>
              {categories.map((subCategory, index) => (
                <React.Fragment key={`${subCategory.name}${index}`}>
                  {subCategory === 'divider' ? (
                    <Divider style={{ margin: '6px 0' }} />
                  ) : (
                    <SidebarCategory
                      depth={depth + 1}
                      depthStep={depthStep}
                      category={subCategory}
                    />
                  )}

                  <List>
                    {subCategory.subcategories.map((subcategory, index) => (
                      <React.Fragment key={`${subcategory.name}${index}`}>
                        {subcategory === 'divider' ? (
                          <Divider style={{ margin: '6px 0' }} />
                        ) : (
                          <SidebarSubCategory
                            depth={depth}
                            depthStep={depthStep}
                            expanded={expanded}
                            subcategory={subcategory}
                            category={subCategory}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                </React.Fragment>
              ))}
            </List>
          </>
        ) : null}
      </Collapse>
    </>
  );
}

function Sidebar({ departments, depthStep, depth, expanded }) {
  const classes = useStyles();

  return (
    <div className={classes.sidebar}>
      <List disablePadding dense style={{ paddingTop: '1rem' }}>
        {departments.map((sidebarCategory, index) => (
          <React.Fragment key={`${sidebarCategory.name}${index}`}>
            {sidebarCategory === 'divider' ? (
              <Divider style={{ margin: '6px 0' }} />
            ) : (
              <>
                <SidebarCategory
                  depthStep={depthStep}
                  depth={depth}
                  expanded={expanded}
                  category={sidebarCategory}
                />
              </>
            )}
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default Sidebar;
