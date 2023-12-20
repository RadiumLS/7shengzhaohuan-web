import { PropsWithChildren, useState } from "react";

// 应用在Play模式下的可移动组件
export type MovablePosition = {
  top: string,
  left: string,
  width: string,
  height: string,
}

const MovableWrapper: React.FC<PropsWithChildren<{defaultPostion: MovablePosition}>> = (props) => {
  const {defaultPostion, children} = props
  // const {top, left} = defaultPostion;
  const [top, setTop] = useState(defaultPostion.top);
  const [left, setLeft] = useState(defaultPostion.left);
  const [width, setWidth] = useState(defaultPostion.width);
  const [height, setHeight] = useState(defaultPostion.height);
  // TODO: 增加可移动, 可放缩能力
  const [showBtn, setShowBtn] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const onContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setShowBtn(!showBtn);
    e.preventDefault();
  }
  return <div style={{
    position: 'absolute',
    top: top,
    left: left,
    width: width,
    height: height,
  }}
    onContextMenu={onContextMenu}
  >
    { showBtn && <button >
      Drag
    </button>}
    // TODO: 放个拖拽的鬼东西出来
    {children}
  </div>
}

export default MovableWrapper;