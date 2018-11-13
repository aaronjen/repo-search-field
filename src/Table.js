import React, { PureComponent } from 'react';
import styled from "styled-components";
import PropTypes from "prop-types";
import CircularProgress from '@material-ui/core/CircularProgress';

import { StarIcon, ForkIcon } from "./Icons";


const Wrapper = styled.div`
  max-height: calc(100vh - 116px);
  padding: 20px;
  overflow-y: scroll;
`;

const Row = styled.tr`
  padding: 12px;

  td {
    border-bottom: 1px solid #dddddd;
    padding: 12px;
  }
  
  svg {
    vertical-align: middle;
    margin-right: 5px;
  }
  td.name{
    text-align:left;
  }
`;

class Table extends PureComponent {
  static defaultProps = {
    loading: false,
    loadMore: () => {}
  }

  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      stargazers_count: PropTypes.number,
      forks: PropTypes.number,
    })).isRequired,
    loading: PropTypes.bool,
    loadMore: PropTypes.func,
  }

  handleScroll = (event) => {
    const { target } = event;
    const { clientHeight, scrollHeight, scrollTop } = target;
    if(clientHeight + scrollTop > scrollHeight - 100) {
      const { loadMore } = this.props;
      loadMore();
    }
  }

  render() {
    const { data, loading } = this.props;

    return (
      <Wrapper onScroll={this.handleScroll}>
        <table style={{width: '100%'}}>
          <tbody>
            {data.map((d, index) => (
              // eslint-disable-next-line
              <Row key={index}>
                <td className="name">
                  {d.name}
                </td>
                <td>
                  <StarIcon/>
                  {d.stargazers_count}
                </td>
                <td>
                  <ForkIcon/>
                  {d.forks}
                </td>
              </Row>
            ))}
          </tbody>
        </table>
        {loading &&
          <div style={{ textAlign: 'center' }}>
            <CircularProgress/>
          </div>
        }
      </Wrapper>
    );
  }
}

export default Table;