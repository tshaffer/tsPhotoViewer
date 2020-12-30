import * as React from 'react';

export default class App extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    console.log('eat more pizza');
  }

  render() {

    return (
      <div>
        pizza
      </div>
    );
  }
}
