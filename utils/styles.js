import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  form: {
    maxWidth: 800,
    margin: '0 auto',
  },
  brand: {
    fontWeight: 'bold !important',
    fontSize: '1.4rem',
  },
  fullWidth: { width: '100% !important' },
  strong: {
    marginRight: '0.5rem !important',
  },
  appbar: {
    borderTop: `2px solid ${theme.palette.divider}`,
  },
  main: {
    padding: '1rem',
    minHeight: '80vh',
  },
  submitButton: {
    marginTop: '1rem',
  },
  spacebetween: {
    justifyContent: 'space-between',
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: '1rem',
    textTransform: 'none',
  },
  mt1: { marginTop: '1rem !important' },
  mt2: { marginBottom: '1rem !important' },

  p1: {
    padding: '1rem !important',
  },
  media: {
    width: '100%',
    maxWidth: '162px',
    margin: '0 auto',
  },
  list: {
    margin: '1rem',
  },
  pading1: {
    padding: '1rem',
  },
  logo: {
    height: 36,
  },
  navBarbutton: {
    ...theme.typography.navButton,
    borderRadius: '50px',
    marginLeft: '50px',
    marginRight: '25px',
    height: '35px',
  },
  navBarAdminbutton: {
    ...theme.typography.navButton,
    borderRadius: '50px',
    marginLeft: '50px',
    marginRight: '25px',
    height: '35px',
  },

  paper: {
    position: 'relative !important',
    marginTop: theme.spacing(2),
    padding: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '800px',
    background:
      'linear-gradient(180deg, rgba(169,198,217,1) 15%, rgba(242,167,75,1) 100%)',
    boxShadow: '.2px 12px 18px rgba(131,153,167,0.6)',

    '&:hover': {
      boxShadow: '0px 24px 36px rgba(131,153,167,0.99)',
    },
  },
  avatar: {
    marginTop: 20,
    position: 'relative',
    background: 'rgba(255,255,255,0.85)',
    width: '100px',
    height: '100px',
    boxShadow: '0px 0px 12px rgba(131,153,167,0.99)',
  },
  icon: {
    width: '80px',
    height: '80px',
    color: 'rgba(131,153,167,0.79)',
  },
  table: {
    //
  },

  tableHead: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '	#5294e2',
    borderColor: '	#5294e2',
    borderWidth: '2',
  },

  tableBody: {
    color: '#4b5162',
    borderColor: '#7c818c',
    borderWidth: '2',
  },

  iconImage: {
    position: 'absolute',
    width: 40,
    height: 40,
  },
  wishImage: {
    position: 'relative',
  },

  textSwiper: {
    position: 'absolute',
    zIndex: '30',
  },
  textWrapperSwipper: {
    position: 'relative',
  },
  ticker: {
    whiteSpace: 'noWrap',
  },
  largeImage: {
    width: '100% !important',
  },
  smallImage: {
    width: '160px !important',
  },

  drawerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '220px',
  },

  sidebarCategotyText: {
    fontSize: '0.8rem',
  },

  sidebarCategory: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sideBarContent: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overFlow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },

  sideBarIcon: {
    marginRight: '6px',
  },
  sideBarText: {
    width: '100%',
    fontSize: '1rem !important',
  },
  expandArrow: {
    fontSize: '1.2rem !important',
  },
  arrowExpanded: {
    color: '#09bb12',
    fontWeight: 'bold',
  },

  drawerHeader: {
    display: 'flex !important',
    alignItems: 'center !important',
    padding: '1rem !important',
    justifyContent: 'flex-end !important',
  },

  swiperContainer: {
    width: '480px',
  },

  /* Checkout Steps */
  checkoutSteps: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '40rem',
    margin: '1rem auto',
  },
  /* sidebar-menu */
  AdminSidebar: {
    backgroundColor: '#efefef',
    display: 'flex',
    padding: '2rem',
    flexDirection: ' column',
    height: 'calc(100vh - 2rem)',
  },

  row: {
    display: 'grid',
    gridTemplateColumns: 'auto 1000px auto 1000px',
    gridGap: 35,
    justifyContent: 'space-between',
  },

  col1: {
    display: 'grid',
    gridTemplateColumns: 'minmax(auto, 300px)',
  },

  col2: {
    flex: '2 1 50rem',
  },

  col3: {
    display: 'grid',
    gridTemplateColumns: 'minmax(auto, 700px,500px) 400px',
  },
  /* review item */
  reviewItem: {
    marginRight: '1rem',
    borderRight: '1px #808080 solid',
    paddingRight: '1rem',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },

  price: {
    color: '#808080',
    fontSize: '1.1rem',
  },

  oldPrice: {
    color: '#606060',
    textDecoration: 'line-through',
    paddingLeft: '0.5rem',
    fontSize: '0.9rem',
  },

  productName: {
    color: '#808080',
    fontSize: '1.1rem',
  },
  homeProductName: {
    marginBottom: '10px',
    color: '#3d3d3d',
    fontSize: '18px !important',
    fontWeight: 'normal',
  },

  dashboardavatar: {
    backgroundColor: '#FF0000',
    height: 56,
    width: 56,
  },

  differenceIcon: {
    color: '#FF0000',
  },
  differenceValue: {
    color: '#FF0000',
    marginRight: '1rem',
  },

  //collapse

  collapse: {
    cursor: 'pointer',
  },
  collapseTitle: {
    border: 'none',
    background: 'none',
    outline: 'none',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
    fontWeight: '15rem',
    padding: '0 50px 32px 16px',
    paddingRight: '72px',
    paddingLeft: '16px',
    position: 'relative',
  },

  collapseContent: {
    padding: '0 72px 32px 16px',
    lineHeight: '10px',
    background: '#b6f2c7 !important',
  },

  collapseActive: {
    transform: 'ease-in-out',
    cursor: 'pointer',
  },
  badge: {
    position: 'absolute',
    zIndex: 1000,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 5,
    padding: 2,
    right: 2,
    fontStyle: 'italic',
  },
  selected: {
    backgroundColor: '#e0e0e0',
  },

  save: {
    color: 'green',
    marginLeft: '0.5rem',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  additionalImage: {
    border: '1px solid #008000 !important',
  },

  textHeading: {
    paddingTop: '1rem',
  },
  swiperslide: {
    alignItems: 'center',
    textAlign: 'center',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    overflow: 'scroll',
  },
  flexSpaceBetween: {
    justifyContent: 'space-between',
  },
  flexAlignItemCenter: {
    alignItems: 'center',
  },
  girdItem: {
    margin: '1rem',
  },
  gridImage: {
    height: 180,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute !important',
    right: 30,
    top: 10,
  },
  deleteIconImage: {
    position: 'absolute',
    color: 'red',
    cursor: 'pointer',
  },
  cropPreviewImage: {
    margin: 5,
    maxWidth: 200,
    height: 'auto',
    maxHeight: 200,
  },
  cropMainContent: {
    width: '100%',
    maxWidth: 600,
  },
  navAvatar: {
    color: 'orange',
    cursor: 'pointer',
  },
  navbar: {
    backgroundColor: '#203040 !important',
    '& a': {
      color: '#ffffff !important',
    },
    '& span': {
      color: '#ffffff !important',
    },
  },
  formSearch: {
    display: 'block !important',
    width: '100% !important',
  },
  mainDrawerMenu: {
    position: 'relative !important',
  },
  dropdown: {
    position: 'absolute !important',
    top: 28,
    right: 0,
    left: 0,
    zIndex: 1,
    border: '1px solid !important',
    padding: theme.spacing(1),
  },
  // navbar
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  justifyContentSpaceBetween: {
    justifyContent: 'space-between',
  },
  smallButton: {
    padding: 0,
    minWidth: 'initial',
  },
  inputLabel: {
    marginTop: '1rem',
    marginBottom: '0.5rem',
  },
  adminLink: {
    textDecoration: 'none',
    listStyleType: 'none',
    fontSize: '18px',
    color: 'gray',
  },
  adminListItem: {
    borderBottom: '1px solid #e0e0e0',
    boxSizing: 'border-box',
    border: '1px solid #e0e0e0',
    boxShadow: '5px 4px #F8E0E0',
  },
  warning: {
    backgroundColor: '#fff9c4',
  },
  success: {
    backgroundColor: '#b9f6ca',
  },
  sidebarSubItems: {
    padding: 0,
  },
  sidebarSubItemsList: {
    width: '100%',
  },
  sidebarSubItem: {
    width: '100%',
  },
  sidebarSubItemActive: {
    backgroundColor: '#f0f0f0',
  },
  sidebarSubItemLink: {
    width: '100%',
  },
  imageSmall: {
    height: '3.6rem',
  },
  thumbnailImage: {
    height: 294,
  },
  thumbnail: {
    minHeight: 476,
    maxWidth: 300,
  },
  swiper: {
    padding: 5,
  },
  // search
  searchForm: {
    border: '1px solid white',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  searchInput: {
    paddingLeft: 5,
  },
  iconButton: {
    backgroundColor: '#f8c040',
    padding: 5,
    borderRadius: '0 5px 5px 0 !important',
    '& span': {
      color: '#000000 !important',
    },
  },
}));
