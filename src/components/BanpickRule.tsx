import { Button, Input, List, Modal, Space, Form, Table, Select } from "antd";
import { useState } from "react";
import { Colorpicker } from "antd-colorpicker";
import { BPPhase, Player } from "../type/bp";

// 未来扩展一下i18n，先放个函数包一下
const t = (i18n: string) => i18n;
type ModalType = 'add' | 'modify';
type BanpickRuleOption = {
  bpRule: BPPhase[],
  bpPlayer: Player[],
  addPlayer: (playerToAdd: Player) => void,
  editPlayer: (playerToEdit: Player) => void,
  addBpPhase: (phaseToAdd: BPPhase) => void,
  delBpPhaseAt: (index: number) => void,
}


// BP规则组件
function BanpickRule({ bpRule, bpPlayer, addPlayer, editPlayer, addBpPhase, delBpPhaseAt }: BanpickRuleOption) {
  // const bpRule = useAppSelector((state) => state.banpick.bpRule);
  // const bpPlayer = useAppSelector((state) => state.banpick.playerList);
  const [showPlayerModal, setShowPlayerModal] = useState<boolean>(false);
  const [showPhaseModal, setShowPhaseModal] = useState<boolean>(false);
  const [playModalType, setPlayModalType] = useState<ModalType>('add');
  const [phaseModalType, setPhaseModalType] = useState<ModalType>('add');
  const [playerForm] = Form.useForm();
  const [phaseForm] = Form.useForm();
  return <div>
    <h3>{t('BP配置')}</h3>
    <p className="bp-rule-wrapper">
      <h4>{t('玩家列表')}</h4>
      <Button onClick={() => {
        setShowPlayerModal(true);
        setPlayModalType('add');
      }}>{t('新增玩家')}</Button>
      <Table
        pagination={false}
        style={{
          width: '50%'
        }}
        dataSource={bpPlayer}
        columns={[{
          dataIndex: 'nickName',
          title: <b>玩家名</b>,
          width: '50%',
          render: (oneName) => <span>{oneName}</span>,
        },{
          dataIndex: 'color',
          title: <b>颜色</b>,
          width: '50%',
          render: (colorStr) => <div className='bp-play-color' style={{backgroundColor: colorStr}}></div>,
        },{
          dataIndex: 'action',
          title: <b>操作</b>,
          width: '50%',
          render: (_, player, index) => <>
            <Space>
              <Button onClick={() => {
                setShowPlayerModal(true);
                setPlayModalType('modify');
                playerForm.setFieldsValue(player);
              }}>{t('修改')}</Button>
              {/* // 暂时不允许删除玩家
              <Button onClick={() => {
                // TODO: 如果bp规则中有引用该玩家，则进行提示
                dispatch(delPlayerAt(index))
              }}>{t('删除')}</Button>
              */}
              <Button onClick={() => alert('TODO: 直接设置已经选择的角色，用于bp中断后继续的情况')}>{t('设置已选角色')}</Button>
            </Space>
          </>,
        }]}
      />
      <Modal
        open={showPlayerModal}
        onCancel={() => setShowPlayerModal(false)}
        onOk={() => {
          playerForm.validateFields().then(() => {
            playerForm.submit();
            setShowPlayerModal(false);
          });
        }}
      >
        <Form
          form={playerForm}
          onFinish={(player) => {
            if(playModalType === 'add') {
              addPlayer(player);
            } else {
              editPlayer(player);
            }
          }}
        >
          <Form.Item
            name={'name'}
            hidden={true}
          ></Form.Item>
          <Form.Item
            label={t('玩家名称')}
            name={'nickName'}
            rules={[
              {
                required: true,
                message: t('玩家名称不能为空')
              }
            ]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label={t('颜色')}
            name={'color'}
          >
            <Colorpicker
              picker='TwitterPicker'
              onColorResult={colorObj => {
                return colorObj.hex;
              }}
              popoverProps={{
                getPopupContainer: (t:HTMLElement) => t,
                destroyTooltipOnHide: true,
                // autoAdjustOverflow: false,
                // placement: 'rightBottom',
                placement: 'bottomLeft',
              }}
              popup={true}
            />
          </Form.Item>
        </Form>
      </Modal>
      <h4>{t('bp阶段配置')}</h4>
      <Space>
        <Button onClick={() => {
          setShowPhaseModal(true);
          setPhaseModalType('add');
          /*
          dispatch(addBpPhase({
            name: '新增的bp阶段',
            type: "ban",
            player: { name: "blue" },
            count: 1
          }));
        <Button onClick={() => dispatch(delAllBpPhase()) }>{t('清除所有BP阶段')}</Button>
          */
        }}>{t('增加bp阶段')}</Button>
      </Space>
      <Table
        pagination={false}
        style={{
          width: '80%'
        }}
        dataSource={bpRule}
        columns={[{
          dataIndex: 'index',
          title: <b>阶段序号</b>,
          render: (_, _record, index) => <span>{index + 1}</span>,
        },{
          dataIndex: 'name',
          title: <b>阶段名称</b>,
          render: (phaseName) => <span>{phaseName}</span>,
        },{
          dataIndex: 'summary',
          title: <b>阶段行为</b>,
          render: (_, onePhase) => <span>
            {`${bpPlayer.find((onePlayer) => onePlayer.name === onePhase.player.name)?.nickName} 选手 ${onePhase.type} ${onePhase.count} 个角色`}
          </span>,
        },{
          dataIndex: 'timeLimit',
          title: <b>时间限制</b>,
          render: (tl) => <span>{tl || t('无')}</span>,
        },{
          dataIndex: 'action',
          title: <b>操作</b>,
          render: (_, _record, index) => 
            <Space>
              <Button onClick={() => {
                setShowPhaseModal(true);
                setPhaseModalType('modify');
              }}>{t('修改')}</Button>
              <Button onClick={() => {
                delBpPhaseAt(index);
              }}>{t('删除')}</Button>
            </Space>
        }]}
      />
      <Modal
        open={showPhaseModal}
        onCancel={() => setShowPhaseModal(false)}
        onOk={() => {
          phaseForm.validateFields().then(() => {
            phaseForm.submit();
            setShowPhaseModal(false);
          }).catch(e => {
            console.log(e)
          });
        }}
      >
        <Form
          form={phaseForm}
          onFinish={(phase) => {
            if(phaseModalType === 'add') {
              addBpPhase({chars: [], ...phase, count: parseInt(phase.count)});
            } else {
              // TODO: 还没想好怎么搞修改的情况，默认名字应该是不能改的。
            }
          }}
        >
          <Form.Item
            label={t('阶段名称')}
            name={'name'}
            rules={[
              {
                required: true,
                message: t('阶段名称不能为空')
              }, (() => ({
                validator(_, pName) {
                  if(bpRule.find((onePhase) => onePhase.name === pName)) {
                    return Promise.reject(new Error(t('阶段名称不能相同')));
                  }
                  return Promise.resolve();
                },
              })),
            ]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label={t('玩家')}
            name={['player', 'name']}
            rules={[
              {
                required: true,
                message: t('玩家名称不能为空')
              },
            ]}
          >
            <Select>
              {
                bpPlayer.map(onePlayer => 
                <Select.Option value={onePlayer.name}>{onePlayer.nickName}</Select.Option>
                )
              }
            </Select>
          </Form.Item>
          <Form.Item
            label={t('行为')}
            name={'type'}
            rules={[
              {
                required: true,
                message: t('行为不能为空')
            // TODO： 换成下拉选取
              },
            ]}
          >
            <Select>
              <Select.Option value={'ban'}>{t('ban')}</Select.Option>
              <Select.Option value={'pick'}>{t('pick')}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={t('角色数量')}
            name={'count'}
            rules={[
              {
                required: true,
                message: t('角色数量不能为空')
              },
            ]}
          >
            <Input type={'number'}/>
          </Form.Item>
          <Form.Item
            label={t('时间限制')}
            name={'timeLimit'}
          >
            <Input type={'number'}/>
          </Form.Item>
        </Form>
      </Modal>
    </p>
  </div>
}
export { 
  BanpickRule
};
