import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import kj from '../images/kj.png'
import close from '../images/close.png'
import './modal.less'

class Modal extends Component {
  constructor() {
    super(...arguments)
    this.state = {

    }
  }
  closeModal() {
    this.props.onCloseMoadl()
  }
  //返回砍价首页
  backBargainIndex() {
    Taro.redirectTo({
      url: '/pages/bargain/bargain/index'
    })
  }
  //砍价失败，查看更多砍价
  moreBargain() {
    Taro.redirectTo({
      url: '/pages/bargain/bargain/index'
    })
  }
  //提示登录
  openMember() {
    this.props.onCloseMoadl()
    Taro.navigateTo({
      url: '/pages/login/index'
    })
  }

  //分享提示
  shareBtnClick() {
    if (process.env.TARO_ENV === 'h5') {
      Taro.showToast({
        title: '请点击右上角分享哦',
        icon: 'none',
        duration: 2000
      })
    }
  }
  //禁止滑动
  preventTouchMove(e) {
    e.stopPropagation()
    e.preventDefault();
    return
  }
  render() {
    const { title, content, btnText, icon, btnType } = this.props
    return (
      <View className='bargainModal' onClick={this.closeModal.bind(this)}>
        <View className='modal-main' onClick={this.preventTouchMove.bind(this)}>
          {
            btnType !== 'back' && <Image src={close} className='close' onClick={this.closeModal.bind(this)} />
          }
          {
            icon
              ? <Image src={icon} className='icon' />
              : <Image src={kj} className='icon' />
          }
          <View class='title'>{title}</View>
          <View className='content'>{content}</View>
          {
            btnType === 'pay' &&
            <Button className='btn' onClick={this.closeModal.bind(this)}>{btnText}</Button>
          }
          {
            btnType === 'back' &&
            <Button className='btn' onClick={this.backBargainIndex.bind(this)}>{btnText}</Button>
          }
          {
            btnType === 'more' &&
            <Button className='btn' onClick={this.moreBargain.bind(this)}>{btnText}</Button>
          }
          {
            btnType === 'confirm' &&
            <Button className='btn' onClick={this.closeModal.bind(this)}>{btnText}</Button>
          }
          {
            btnType === 'member' &&
            <Button className='btn' onClick={this.openMember.bind(this)}>{btnText}</Button>
          }
          {
            btnType === 'share' &&
            <Button className='btn' openType='share' onClick={this.shareBtnClick.bind(this)}>{btnText}</Button>
          }
        </View>
      </View>
    )
  }
}
Modal.defaultProps = {
  title: '',
  content: ''
};
export default Modal;
