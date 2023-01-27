import './App.css';
import { MyLayout } from './layout/MyLayout.tsx';
import { MyRouter } from './MyRouter';

function App() {
  return <>
    <MyLayout>
      <MyRouter></MyRouter>
    </MyLayout>
  </>;
}

export {
  App
};
