import React from 'react';
import {
  Paper,
  FormControl,
  FormControlLabel,
  TextField,
  Radio,
  RadioGroup,
  MenuItem,
  Grid,
  Theme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import {
  observer, modulesStore, authStore,
} from '~store';
import { getModules } from '~api';
import TablePagination from './TablePagination';
import { ModuleSorting } from '~types';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(2, 4, 6, 4),
    padding: theme.spacing(4, 4, 3, 4),
    width: '100%',
    maxWidth: `calc(1000px - ${theme.spacing(4) * 2}px)`,
  },
  content: {
    margin: 0,
    padding: 0,
    paddingTop: 8,
    display: 'flex',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  pagination: {
    paddingRight: 0,
  },
}));

type RadioOption = 'all' | 'user' | 'trusted' | 'flagged';

export default observer((): JSX.Element => {
  const classes = useStyles();
  const [searchTimeout, setSearchTimeout] = React.useState(undefined as NodeJS.Timeout | undefined);
  const [selectedRadio, setSelectedRadio] = React.useState('all' as RadioOption);

  const onSearchChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>): void => {
    if (searchTimeout) clearTimeout(searchTimeout);

    const { target } = e;
    modulesStore.setSearch(target.value as string);

    setSearchTimeout(setTimeout(() => {
      getModules();
    }, 1500));
  };

  const onFilterChange = (_: React.ChangeEvent<{}>, value: string): void => {
    const val = value as RadioOption;

    if (val !== selectedRadio) {
      if ((!authStore.isAuthed || authStore.isDefault) && val === 'flagged') return;

      setSelectedRadio(val);
      modulesStore.setSearchFilter(val);
      getModules();
    }
  };

  const onChangeModuleSorting = (e: React.ChangeEvent<{ name?: string; value: unknown }>): void => {
    const moduleSorting = e.target.value as ModuleSorting;

    if (moduleSorting !== modulesStore.moduleSorting) {
      modulesStore.setModuleSorting(moduleSorting);
      getModules();
    }
  };

  return (
    <Paper className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <TextField
            id="search-query"
            label="Search Modules"
            InputLabelProps={{ shrink: true }}
            value={modulesStore.search || ''}
            onChange={onSearchChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={7}>
          <TablePagination className={classes.pagination} />
        </Grid>
        <Grid item xs={8}>
          <FormControl>
            <RadioGroup
              name="module-filter"
              value={selectedRadio}
              onChange={onFilterChange}
              row
            >
              <FormControlLabel value="all" label="All Modules" control={<Radio />} />
              <FormControlLabel value="trusted" label="Trusted Modules" control={<Radio />} />
              {authStore.isAuthed && <FormControlLabel value="user" label="My Modules" control={<Radio />} />}
              {authStore.isAuthed && !authStore.isDefault && (
                <FormControlLabel value="flagged" label="Flagged Modules" control={<Radio />} />
              )}
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <TextField
            id="module-sorting-filter"
            label="Module Sorting"
            value={modulesStore.moduleSorting}
            onChange={onChangeModuleSorting}
            select
            fullWidth
          >
            <MenuItem value="DATE_CREATED_DESC">Date (Newest to Oldest)</MenuItem>
            <MenuItem value="DATE_CREATED_ASC">Date (Oldest to Newest)</MenuItem>
            <MenuItem value="DOWNLOADS_DESC">Downloads (High to Low)</MenuItem>
            <MenuItem value="DOWNLOADS_ASC">Downloads (Low to High)</MenuItem>
          </TextField>
        </Grid>
      </Grid>
    </Paper>
  );
});
