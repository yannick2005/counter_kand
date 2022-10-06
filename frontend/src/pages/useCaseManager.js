import React, { useEffect, useState, Fragment } from 'react';
import { Route, Navigate, Link } from 'react-router-dom';
import {
  withStyles,
  Typography,
  Fab,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField
} from '@material-ui/core';
import { Delete as DeleteIcon, Create as CreateIcon, Add as AddIcon } from '@material-ui/icons';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import moment from 'moment';
import { find, orderBy, filter } from 'lodash';

import ReCAPTCHA from "react-google-recaptcha";
import { captcha_site_key } from '../components/config';
import UseCaseEditor from '../components/useCaseEditor';
import ErrorSnackbar from '../components/errorSnackbar';
import LoadingBar from '../components/loadingBar'
import InfoSnackbar from '../components/infoSnackbar'

const API = process.env.REACT_APP_BACKEND_URL;

const styles = theme => ({
  useCaseDiv: {
    marginTop: theme.spacing(2),
    outline: 0,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    }
  },
  serachDiv: {
    marginBottom: theme.spacing(1)
  },
  searchInput: {
    width: "100%",
  }
});

function UseCaseManager(props) {
  const { classes } = props;

  const [captureValue, setCaptureValue] = useState(localStorage.getItem("captureValue") || "[empty]");
  const [captureLoad, setCaptureLoad] = useState(JSON.parse(localStorage.getItem("captureLoad")) || false);
  const [captureExpired, setCaptureExpired] = useState(JSON.parse(localStorage.getItem("captureExpired")) || true);

  const [query, setQuery] = useState("");
  const [useCases, setUseCases] = useState([]);
  const [useCasesFiltered, setUseCasesFiltered] = useState([]);

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const _reCaptchaRef = React.createRef();

  useEffect(() => {
    // if captcha is empty execute the captcha query, prompt users some random pictures
    if (_reCaptchaRef.current &&
      (captureExpired === null || captureExpired === false)) {
      _reCaptchaRef.current.execute()
    }

    getUseCases();
  }, []);

  useEffect(() => {
    let filteredObjects = filter(useCases, function (obj) {
      return obj.name.toUpperCase().includes(query.toUpperCase());
    })

    setUseCasesFiltered(filteredObjects);
  }, [query, useCases]);

  const fetch = async (method, endpoint, body) => {
    setLoading(true);

    try {
      const response = await fetch(`${API}/api${endpoint}`, {
        method,
        body: body && JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
      });

      setLoading(false);

      if (response.ok && (response.status === 201 || response.status === 200)) {
        return await response.json();
      } else {
        console.error(response.status)
        setError({ message: "Error when communicating with backend: " + response.statusText })
      }
    } catch (error) {
      console.error(error);

      setError(error)
      setLoading(false);
    }
  }

  const getUseCases = () => {
    fetch('get', '/useCases')
      .then(useCases => {
        setUseCases(useCases);
      })
  }

  const onSaveUseCase = async (id, name, pinCode, measurementOptions) => {
    const postData = {
      name: name,
      pinCode: pinCode,
      measurementOptions: measurementOptions
    }

    if (id) {
      await fetch('put', `/useCases/${id}`, postData);
    } else {
      await fetch('post', '/useCases', postData);
    }

    getUseCases()

    if (error === null) {
      props.history.goBack();
    }
  }

  const deleteUseCase = async (useCase) => {
    if (window.confirm(`Are you sure you want to delete "${useCase.name}"`)) {
      // delete also all measurements
      let measurements = await fetch('get', `/useCases/${useCase.id}/measurements`);

      fetch('delete', `/useCases/${useCase.id}`);

      measurements.measurementOptions.forEach(function (element) {
        fetch('delete', `/measurements/${element.id}`);
      })

      if (error === null) {
        setSuccess({ success: "Use case successfully deleted" })
      }

      getUseCases();
    }
  }

  const handleCaptchaChange = value => {
    // if value is null recaptcha expired
    if (value === null) {
      setCaptureValue("[empty]");
      setCaptureLoad(true)
      setCaptureExpired(true)
    } else {
      setCaptureValue(value);
      setCaptureLoad(true)
      setCaptureExpired(false)

      localStorage.setItem("captureValue", value)
      localStorage.setItem("captureLoad", true)
      localStorage.setItem("captureExpired", false)
    }
  };

  const handleSearchChange = evt => {
    setQuery(evt.target.value);
  };

  const renderUseCaseEditor = ({ match }) => {
    let id = match.params.id
    let useCase = find(useCases, { id: Number(id) });

    if ((!useCase && match.path.includes("copy")) || (!useCase && id !== 'new')) {
      return <Navigate to="/useCases" />
    }

    // reset useCaseId if copying usecase
    // create new object
    if (match.path.includes("copy")) {
      useCase = Object.create(useCase)
      useCase.name = useCase.name + " (Copy)"
    }

    return (
      <UseCaseEditor
        useCase={useCase}
        errorMessage={error}
        onSave={onSaveUseCase}
      />
    )
  };

  return (
    <Fragment>
      <Typography variant="h4">Use Cases</Typography>
      { /* captcha section */}
      {(captureExpired === null || captureExpired === true) && (captcha_site_key) &&
        <ReCAPTCHA
          ref={_reCaptchaRef}
          sitekey={captcha_site_key}
          size="invisible"
          onChange={handleCaptchaChange}
        />
      }

      { /* use case area */}
      {useCases.length > 0 ? (
        // usecases available
        <Paper elevation={1} className={classes.useCaseDiv}>
          <div className={classes.serachDiv}>
            <TextField
              required
              type="text"
              key="inputQuery"
              placeholder="Search"
              label="Search"
              className={classes.searchInput}
              value={query}
              onChange={handleSearchChange}
              variant="outlined"
              size="small"
              autoFocus
            />
          </div>

          <List>
            {orderBy(useCases, ['updatedAt', 'name'], ['desc', 'asc']).map(useCase => (
              <ListItem key={useCase.id} button component={Link} to={`/useCases/${useCase.id}/measurements`}>
                <ListItemText
                  primary={useCase.name}
                  secondary={useCase.updatedAt && `Updated ${moment(useCase.updatedAt).fromNow()}`}
                />
                {(captureExpired !== null && captureExpired === false) && (
                  <ListItemSecondaryAction>
                    <IconButton component={Link} to={`/useCases/${useCase.id}/copy`} color="inherit">
                      <FileCopyIcon />
                    </IconButton>
                    <IconButton component={Link} to={`/useCases/${useCase.id}/edit`} color="inherit">
                      <CreateIcon />
                    </IconButton>
                    <IconButton onClick={() => deleteUseCase(useCase)} color="inherit">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}

            { /* must be placed here so that the state is correctly loaded */}
            <Route exact path="/useCases/:id/edit" render={renderUseCaseEditor} />
            <Route exact path="/useCases/:id/copy" render={renderUseCaseEditor} />
          </List>
        </Paper>


      ) : (
        // no usecases available
        !loading && (
          <Typography variant="subtitle1">So far no use cases have been created</Typography>
        )
      )}

      <Fragment>
        <Fab
          color="secondary"
          aria-label="add"
          className={classes.fab}
          component={Link}
          to="/useCases/new"
        >
          <AddIcon />
        </Fab>

        <Route exact path="/useCases/:id" render={renderUseCaseEditor} />
      </Fragment>

      { /* Flag based display of loadingbar */}
      {loading && (
        <LoadingBar />
      )}

      { /* Flag based display of error snackbar */}
      {error && (
        <ErrorSnackbar
          onClose={() => setError({ error: null })}
          message={error.message}
        />
      )}

      { /* Flag based display of info snackbar */}
      {success && (
        <InfoSnackbar
          onClose={() => setSuccess({ success: null })}
          message={success}
        />
      )}
    </Fragment>
  );
}

export default withStyles(styles)(UseCaseManager);
