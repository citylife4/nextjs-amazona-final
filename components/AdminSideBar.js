import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
  Typography,
} from '@material-ui/core';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useStyles } from '../utils/styles';

function AdminSidebar(props) {
  const router = useRouter();
  const classes = useStyles();
  const items = [
    {
      name: 'DATA CENTER',
      subItems: [{ name: 'Dashboard', link: '/admin/dashboard' }],
    },
    {
      name: 'CATALOG',
      subItems: [
        { name: 'Products', link: '/admin/products' },
        { name: 'Coupons', link: '/admin/coupons' },
        { name: 'Store Locations', link: '/admin/cities' },
        { name: 'Settings', link: '/admin/settings' },
        { name: 'Departments', link: '/admin/departments' },
      ],
    },
    {
      name: 'CUSTOMERS',
      subItems: [{ name: 'Users', link: '/admin/users' }],
    },
    {
      name: 'TRANSACTIONS',
      subItems: [{ name: 'Orders', link: '/admin/orders' }],
    },
  ];

  return (
    <div>
      {items.map((item) => (
        <Accordion
          key={item.name}
          defaultExpanded={
            item.subItems.find((x) => x.link === router.pathname) ? true : false
          }
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>{item.name}</Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.sidebarSubItems}>
            <List className={classes.sidebarSubItemsList}>
              {item.subItems.map((subItem) => (
                <ListItem
                  button
                  className={
                    router.pathname === subItem.link
                      ? [classes.sidebarSubItem, classes.sidebarSubItemActive]
                      : classes.sidebarSubItem
                  }
                  key={subItem.name}
                >
                  <NextLink href={subItem.link}>
                    <a className={classes.sidebarSubItemLink}>{subItem.name}</a>
                  </NextLink>
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

export default AdminSidebar;
