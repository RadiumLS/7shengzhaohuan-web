import { PropsWithChildren, useState } from "react";

// 应用在Play模式下的可移动组件
export type MovablePosition = {
  title?: string,
  top: string,
  left: string,
  width?: string,
  height?: string,
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
  const [isScaling, setIsScaling] = useState(false);
  // 记录点击时候的坐标
  const [downX, setDownX] = useState(0);
  const [downY, setDownY] = useState(0);
  const [parentLeft, setParentLeft] = useState(0);
  const [parentTop, setParentTop] = useState(0);
  const onContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setShowBtn((currShowBtn) => !currShowBtn);
    e.preventDefault();
  };
  const onMouseDown = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setIsMoving(true);
    setDownX(e.screenX);
    setDownY(e.screenY);
    setParentLeft(e.currentTarget.parentElement?.clientLeft || 0);
    setParentTop(e.currentTarget.parentElement?.clientTop || 0);
  };
  const onMouseUp = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setIsMoving(false);
  }
  const onMouseMove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const {screenX, screenY} = e;
    const deltaX = screenX - downX;
    const deltaY = screenY - downY;
    if(isMoving) {
      setTop((currTop) => `${parseFloat(currTop) + deltaY}px`);
      setLeft((currLeft) => `${parseFloat(currLeft) + deltaX}px`);
    }
    setDownX(screenX);
    setDownY(screenY);
  }
  return <div style={{
    position: 'absolute',
    top: top,
    left: left,
    width: width,
    height: height,
  }}
    onContextMenu={onContextMenu}
    className={showBtn ? 'border-solid border-2 border-red-500' : ""}
  >
    { showBtn && <p className="absolute -top-12">
      <button
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseLeave={() => setIsMoving(false)}
        onMouseUp={onMouseUp}
        className="p-4"
      >
        按住，慢慢拖动
      </button>
      <span className="bg-white color-black ml-4 p-4">
        {defaultPostion.title}
      </span>
    </p>}
    {children}
  </div>
}

export default MovableWrapper;