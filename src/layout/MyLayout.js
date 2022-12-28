import { Layout } from 'antd';
import MyMenu from './Menu';

const { Header, Content, Footer, Sider } = Layout;


function MyLayout({ children }) {
  return (
    <Layout hasSider>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <MyMenu/>
      </Sider>
      <Content
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
        }}
      >
        {children}
      </Content>
    </Layout>
  )
}

export default MyLayout;
