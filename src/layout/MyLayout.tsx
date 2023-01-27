import { Layout } from 'antd';
import { MyMenu } from './Menu.tsx';

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
          height: '100vh',
          overflow: 'auto',
        }}
      >
        {children}
      </Content>
    </Layout>
  )
}

export {
  MyLayout
};
