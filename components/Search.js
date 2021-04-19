import React from 'react';

import { Button, InputBase } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useStyles } from '../utils/styles';


function Search() {
  const classes = useStyles();
  return (
    <form action="/search" className={classes.formSearch}>
      <InputBase
        name="query"
        placeholder="Search Products here…"
        inputProps={{ 'aria-label': 'search' }}
      />
      <Button
        type="submit"
        className={classes.searchButton}
      ><SearchIcon /></Button>
    </form>
  );
}

export default Search;
