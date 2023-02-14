import { Button } from "antd";
import { addBpPhase, delBpPhaseAt } from "../redux/banpickCharPool";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

// 未来扩展一下i18n，先放个函数包一下
const t = (i18n: string) => i18n;

// BP规则组件
function BanpickRule() {
  const bpRule = useAppSelector((state) => state.banpick.bpRule);
  const dispatch = useAppDispatch();
  return <div>
    <h3>{t('BP配置')}</h3>
    <p className="bp-rule-wrapper">
      <Button onClick={() => dispatch(addBpPhase({
        name: '新增的bp阶段',
        type: "ban",
        player: "blue",
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
            <th>{`${onePhase.player} 选手 ${onePhase.type} ${onePhase.count} 个角色`}</th>
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
