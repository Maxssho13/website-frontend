import React from 'react';
import {
  Paper,
  Theme,
  withTheme,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    margin: theme.spacing(2),
    width: `calc(100vw - ${theme.spacing(2) * 2}px)`,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    padding: theme.spacing(2, 0, 0, 2),
    width: `calc(100% - 64px - ${theme.spacing(2) * 3}px)`,
  },
  title: {
    width: '100%',
  },
  author: {
    marginTop: 0,
    width: '70%',
  },
  titleChip: {
    display: 'flex',
  },
  versionChip: {
    marginRight: theme.spacing(1),
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(0, 2, 0, 2),
  },
  imageOuter: {
    alignSelf: 'center',
    justifySelf: 'center',
    flexGrow: 1,
    paddingLeft: 0,
  },
  image: {
    maxWidth: `calc(100vw - ${theme.spacing(2) * 4}px)`,
    maxHeight: '180px',
  },
  actions: {
    width: '300px',
  },
  markdownViewer: {
    paddingBottom: theme.spacing(1),
  },
  viewButton: {
    margin: theme.spacing(4, 2, 2, 0),
  },
}));

export default withTheme(({ theme }: { theme: Theme }): JSX.Element => {
  const classes = useStyles();

  return (
    <Paper
      className={classes.root}
      elevation={4}
    >
      <div className={classes.header}>
        <div className={classes.titleContainer}>
          <div className={classes.titleChip}>
            <Skeleton className={classes.title} height={24} />
          </div>
          <Skeleton className={classes.author} />
        </div>
        <Skeleton className={classes.viewButton} />
      </div>
      <div className={classes.body}>
        <div className={classes.markdownViewer}>
          {(() => {
            let short = false;

            return Array(Math.floor(Math.random() * 4 + 3)).fill(undefined).map((_, i) => i).map(n => {
              let width: string;

              if (!short && Math.random() <= 0.2 && n > 2) {
                width = `calc(100vw - ${theme.spacing(2) * 2}px - ${Math.random() * 20 + 60}vw)`;
                short = true;
              } else {
                width = `calc(100vw - ${theme.spacing(2) * 2}px - ${Math.random() * 10 + 10}vw)`;
              }

              return <Skeleton key={n} style={{ width }} />;
            });
          })()}
        </div>
      </div>
    </Paper>
  );
});