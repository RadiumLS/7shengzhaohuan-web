import './App.css';
import { Provider } from 'react-redux';
import { myStore } from './redux';
import { MyLayout } from './layout/MyLayout';
import { MyRouter } from './MyRouter';

function App() {
  return <Provider store={myStore}>
    <MyLayout>
      <MyRouter></MyRouter>
    </MyLayout>
  </Provider>;
}

export {
  App
};
