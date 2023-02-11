// 欢迎页，当作首页来用了
import { Layout } from 'antd';

const C_ICP_BEIAN = process.env.REACT_APP_ICP_BEIAN;
function Wellcom() {
  return <Layout style={{height: '100%'}}>
    <div style={{height: '100%'}}>
      <h2>
      欢迎来到七圣召唤模拟！
      </h2>
    </div>
    { C_ICP_BEIAN &&
    <Layout.Footer style={{textAlign: 'center'}}>
      <a href='http://beian.miit.gov.cn/' target='_blank'>{C_ICP_BEIAN}</a>
    </Layout.Footer>
    }
  </Layout>
}

export default Wellcom;

