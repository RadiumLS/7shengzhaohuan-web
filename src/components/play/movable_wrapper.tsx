import { PropsWithChildren, useState } from "react";

// 应用在Play模式下的可移动组件
export type MovablePosition = {
  title?: string,
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

  const [showBtn, setShowBtn] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  // 记录点击时候的坐标
  const [downX, setDownX] = useState(0);
  const [downY, setDownY] = useState(0);
  const onContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setShowBtn((currShowBtn) => !currShowBtn);
    e.preventDefault();
  };
  const onMouseDown = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setIsMoving(true);
    setDownX(e.screenX);
    setDownY(e.screenY);
    if(e.currentTarget.parentElement?.parentElement) {
      const ppElement = e.currentTarget.parentElement.parentElement;
      if(e.currentTarget.id === 'move-btn') {
        setLeft(`${ppElement.offsetLeft}px`);
        setTop(`${ppElement.offsetTop}px`);
      } else if(e.currentTarget.id === 'resize-btn') {
        setWidth(`${ppElement.offsetWidth}px`);
        setHeight(`${ppElement.offsetHeight}px`);
      }
    }
  };
  const onMouseUp = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setIsMoving(false);
  }
  const onMouseMove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const {screenX, screenY} = e;
    const deltaX = screenX - downX;
    const deltaY = screenY - downY;
    if(isMoving) {
      if(e.currentTarget.id === 'move-btn') {
        setTop((currTop) => `${parseFloat(currTop) + deltaY}px`);
        setLeft((currLeft) => `${parseFloat(currLeft) + deltaX}px`);
      } else if(e.currentTarget.id === 'resize-btn') {
        setWidth((currWidth) => `${parseFloat(currWidth) + deltaX}px`);
        setHeight((currHeight) => `${parseFloat(currHeight) + deltaY}px`);
      }
    }
    setDownX(screenX);
    setDownY(screenY);
  }
  const resetWidthHeight = () => {
    setWidth(defaultPostion.width);
    setHeight(defaultPostion.height);
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
        id="move-btn"
      >
        按住，慢慢拖动
      </button>
      <span className="bg-white color-black ml-4 p-4">
        {defaultPostion.title}
      </span>
    </p>}
    {children}
    { showBtn && <p className="absolute -bottom-10 -right-2">
      <button
        onClick={resetWidthHeight}
      >重置大小</button>
      <button
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseLeave={() => setIsMoving(false)}
        onMouseUp={onMouseUp}
        className="ml-2 p-2"
        id="resize-btn"
      >
        按住，慢慢缩放
      </button>
    </p>}
  </div>
}

export default MovableWrapper;