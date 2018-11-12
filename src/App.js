import React, { PureComponent } from 'react';
import TextField from "@material-ui/core/TextField";
import styled from "styled-components";
import axios, { CancelToken } from "axios";

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
    })
    this.timer = setTimeout(async () => {
      const url = `https://api.github.com/search/repositories?q=${value}`;
      this.source = CancelToken.source();
      try {
        const response = await axios.get(url, {
          cancelToken: this.source.token,
        });
        this.setState({
          repos: response.data.items,
          loading: false,
        });
      } catch(error) {
        console.log('handle error', error);
        this.setState({
          loading: false,
        })
      }
      
    }, 500);
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
        {loading? <div>loading</div> : <Table
          data={repos}
        />}
      </Wrapper>
    );
  }
}

export default App;
