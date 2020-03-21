import React, {Component} from 'react'
import { Upload, Modal, Icon, message } from 'antd';
import {reqDeleteImg} from '../../api'
import {BASE_IMG_URL} from "../../utils/constants";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends Component {
  	constructor(props){
  		super(props)
  		let fileList = []
  		const imgs = this.props.pictureList
  		if (imgs && imgs.length>0) {
  			fileList = imgs.map((img, index) => ({
		        uid: -index, // 每个file都有自己唯一的id
		        name: img, // 图片文件名
		        status: 'done', // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
		        url: BASE_IMG_URL + img
		      }))
  		}
  		this.state = {
		    previewVisible: false,
		    previewImage: '',
		    // fileList: [
		    //   // {
		    //   //   uid: '-1',
		    //   //   name: 'image.png',
		    //   //   status: 'done', //uploading,done,error,removed
		    //   //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
		    //   // },
		    // ],
		    fileList: fileList
  		}
	}

  handleCancel = () => {
  	this.setState({ previewVisible: false });
  }

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    })
  }

  handleChange = async ({ file,fileList }) => {
  	if (file.status==='done') {
  		const result = file.response
  		if(result.status===0) {
  			message.success('upload success')
  			const {url,name} = result.data
  			file = fileList[fileList.length-1]
  			file.name=name
  			file.url = url
  		}
  		else {
  			message.error('upload failed')
  		}
  	}
  	else if (file.status==='removed') { // 删除图片
      const result = await reqDeleteImg(file.name)
      if (result.status===0) {
        message.success('image is removed!')
      } else {
        message.error('image remove is failed!')
      }
    }
  	this.setState({ fileList })
  	const fileListNameOnly = this.state.fileList.map(file => file.name)
  	this.props.pictureListGet(fileListNameOnly)
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state
    const uploadButton = (
      <div>
      <Icon type='plus' theme="outlined"/>
        <div>Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/manage/img/upload"
          accept='image/*'
          name='image'
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}