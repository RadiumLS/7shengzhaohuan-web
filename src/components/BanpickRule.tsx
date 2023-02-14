import { Button, List, Space, Table } from "antd";
import { addBpPhase, delBpPhaseAt } from "../redux/banpickCharPool";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { render } from '@testing-library/react';

// 未来扩展一下i18n，先放个函数包一下
const t = (i18n: string) => i18n;

// BP规则组件
function BanpickRule() {
  const bpRule = useAppSelector((state) => state.banpick.bpRule);
  const bpPlayer = useAppSelector((state) => state.banpick.playerList);
  const dispatch = useAppDispatch();
  return <div>
    <h3>{t('BP配置')}</h3>
    <p className="bp-rule-wrapper">
      <h4>{t('玩家列表')}</h4>
      <Button onClick={() => alert('TODO: 弹出新增玩家框框')}>{t('新增玩家')}</Button>
      <Table
        pagination={false}
        style={{
          width: '50%'
        }}
        dataSource={bpPlayer}
        // TODO: 增加玩家表格配置
        columns={[{
          dataIndex: 'name',
          title: <b>玩家名</b>,
          width: '50%',
          render: (oneName) => <span>{oneName}</span>,
        },{
          dataIndex: 'action',
          title: <b>操作</b>,
          width: '50%',
          render: (_, index) => <>
            <Space>
              <Button onClick={() => alert('TODO: 弹出修改玩家框框')}>{t('修改')}</Button>
              <Button onClick={() => alert('TODO: 直接删除')}>{t('删除')}</Button>
            </Space>
          </>,
        }]}
      />
      <h4>{t('bp阶段配置')}</h4>
      <Button onClick={() => dispatch(addBpPhase({
        name: '新增的bp阶段',
        type: "ban",
        player: { name: "blue" },
        count: 1
      })) }>{t('增加bp阶段')}</Button>
      <table>
        <thead>
          <tr>
            <th>{t('阶段序号')}</th>
            <th>{t('阶段名称')}</th>
            <th>{t('阶段行为')}</th>
            <th>{t('时间限制')}</th>
            <th>{t('操作')}</th>
          </tr>
        </thead>
      {
        bpRule.map((onePhase, index) => <>
          <tr>
            <th>{index + 1}</th>
            <th>{onePhase.name}</th>
            <th>{`${onePhase.player.name} 选手 ${onePhase.type} ${onePhase.count} 个角色`}</th>
            <th>{onePhase.timeLimit}</th>
            <th><a onClick={() => {
              dispatch(delBpPhaseAt(index));
            }}>{t('删除')}</a></th>
          </tr>
        </>)
      }
      </table>
    </p>
  </div>
}
export { 
  BanpickRule
};
