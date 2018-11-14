import React, { PureComponent } from 'react';
import TextField from "@material-ui/core/TextField";
import styled from "styled-components";
import axios from "axios";
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from "@material-ui/core/Button";

import { parseLinkHeader } from "./utils";
import Table from './Table';

const Wrapper = styled.div`
  width: 100%;

  .input-field {
    margin: auto;
    width: 80%;
    display: flex;
    margin-top: 20px;
  }
`;


class App extends PureComponent {
  state = {
    q: '',
    loading: false,
    repos: [],
  }

  handleChange = (event) => {
    const { value } = event.target;
    
    if(value === '') {
      this.setState({
        q: value,
        loading: false,
        repos: [],
        error: null,
      });
      return;
    }

    if(this.timer) {
      clearTimeout(this.timer);
    }
    if(this.source) {
      this.source.cancel();
    }
    this.setState({
      q: value,
      loading: true,
      repos: [],
      error: null,
    })
    this.timer = setTimeout(async () => {
      const url = `https://api.github.com/search/repositories?q=${value}`;
      this.source = axios.CancelToken.source();
      try {

        const response = await axios.get(url, {
          cancelToken: this.source.token,
        });

        const linkString = response.headers.link;
        const link = parseLinkHeader(linkString);
        

        this.setState({
          repos: response.data.items,
          loading: false,
          nextPage: link.next,
        });
      } catch(error) {
        this.handleRequestError(error);
      }
    }, 500);
  }

  handleLoadMore = async () => {
    const { loading, nextPage, error } = this.state;
    // return if loading, hasNoMore
    if(loading || !nextPage || error) return;
    this.setState({
      loading: true,
    })

    try {
      const response = await axios.get(nextPage);
      const linkString = response.headers.link;
      const link = parseLinkHeader(linkString);
      this.setState(prev => ({
        loading: false,
        repos: [...prev.repos, ...response.data.items],
        nextPage: link.next
      }))
    } catch (err) {
      this.handleRequestError(err);
    }
  }

  handleRequestError = (error) => {
    if(axios.isCancel(error)) return;
    const { response } = error;
    console.log(response);
    if(response.headers['x-ratelimit-remaining'] === "0") {
      this.setState({
        loading: false,
        error: 'no-ratelimit-remaining',
      })
    }
    else {
      this.setState({
        loading: false,
        error: 'others',
      })
    }
  }

  handleRetry = () => {
    this.setState({
      loading: false,
      error: null,
    })
  }

  render() {
    const { q, repos, loading, error } = this.state;
    
    return (
      <Wrapper>
        <TextField
          value={q}
          className="input-field"
          onChange={this.handleChange}
          variant="outlined"
        />
        <Table
          data={repos}
          loading={loading}
          loadMore={this.handleLoadMore}
        >
          {error === 'no-ratelimit-remaining' &&
            <div style={{ textAlign: 'center', padding: 20 }}>
              已達到 api 請求上限，請稍後再試 <Button variant="outlined" onClick={this.handleRetry}>
                重試
              </Button>
            </div>
          }
          {loading &&
            <div style={{ textAlign: 'center', padding: 20 }}>
              <CircularProgress/>
            </div>
          }
        </Table>
      </Wrapper>
    );
  }
}

export default App;
