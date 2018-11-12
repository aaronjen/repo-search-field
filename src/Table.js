import React, { PureComponent } from 'react';
import styled from "styled-components";
import { StarIcon, ForkIcon } from "./Icons";

const Wrapper = styled.table`
  height: calc(100vh - 76px);
  width: 100vw;
  padding: 20px;
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
    data: [],
  }
  
  state = {}

  render() {
    const { data } = this.props;

    console.log(data);

    return (
      <Wrapper>
        <tbody>
          {data.map(d => (
            <Row key={d.id}>
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
      </Wrapper>
    );
  }
}

export default Table;