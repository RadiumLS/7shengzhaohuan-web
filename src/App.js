import logo from './logo.svg';
import './App.css';
import MyLayout from './layout/MyLayout';
import MyRouter from './MyRouter';

function App() {
  return <>
    <MyLayout>
      <MyRouter></MyRouter>
    </MyLayout>
  </>;
}

export default App;
