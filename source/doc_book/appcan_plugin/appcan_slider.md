# appcan_Slider 左右滑动切换图片


##appcan.Slide(selector,dir,endFun,lock,transEnd)
界面随着手指的移动进行跟随，当松手时根据位移情况来进行平移变换，产生弹动的效果。
`selector`:此对象所属的滑块控件
`dir`:是纵向滑动(V)还是横向滑动(H)
`endFun`:手指滑动结束离开屏幕时的事件回调
`lock`:用来控制手指触摸事件是否继续分发给下层的DOM控件和浏览器，这里我们不需要进行控制，因此设定为false
`transEnd`:手指松开后，界面自动滑动完成分页切换后执行的回调函数。