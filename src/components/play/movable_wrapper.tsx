import { PropsWithChildren } from "react";

// 应用在Play模式下的可移动组件
export type MovablePosition = {
  top: string,
  left: string,
}

const MovableWrapper: React.FC<PropsWithChildren<{defaultPostion: MovablePosition}>> = (props) => {
  const {defaultPostion, children} = props
  // TODO: 增加可移动, 可放缩能力
  return <div>
    {children}
  </div>
}

export default MovableWrapper;