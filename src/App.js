import React, { PureComponent } from 'react';
import TextField from "@material-ui/core/TextField";
import styled from "styled-components";
import axios from "axios";

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
        console.log('handle error', error);
        this.setState({
          loading: false,
        })
      }
      
    }, 500);
  }

  handleLoadMore = async () => {
    const { loading, nextPage } = this.state;
    // return if loading, hasNoMore
    if(loading || !nextPage) return;
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
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { q, repos, loading } = this.state;
    
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
        />
      </Wrapper>
    );
  }
}

export default App;
