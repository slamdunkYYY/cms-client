import React, {Component} from 'react'
import {
	Card,
	Table,
	Button,
	Icon,
	Divider,
	message,
	Modal,
	Popconfirm
} from 'antd'
import {reqCategories,reqUpdateCategory,reqAddCategory} from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'


export default class category extends Component {
   constructor(props){
        super(props);
		this.initColumns()
    }

	state = {
		categories: [],
		loading: false,
		showStatus: 0, //0,1,2
		parentId: '0',
		parentName:'',
		subCategories:[],
		updatedItem:'',
	}


	initColumns=()=>{
		this.columns = [
		 {
		    title: 'Name',
		    dataIndex: 'name',
		  },
		  {
		    title: 'Action',
		    width: 300,
			render: (category) => {
				const {parentId} = this.state
				return (
					<span>
			          <Button type="link" onClick={() => {this.showUpdateCategory(category)}}>Update</Button>
			          {	(parentId==='0')?<Divider type="vertical" />:null}
			          {
			          	(parentId==='0')?
			          <Button type="link" onClick={() => {this.handleCheckSubCategory(category)}}
              >Check sub category</Button>: null
              }
			        </span>
      			)
			}		  
		  },
		]
	} 

	handleCheckSubCategory = (category) => {
		console.log("this",this)	
		this.setState({
			parentId:category._id,
			parentName: category.name
		},() => {
      this.getCategories()
      console.log("this",this)	
    })
	}

	getCategories = async () => {
		const {parentId} = this.state
		this.setState({loading:true})
		const result = await reqCategories(parentId)
		console.log("result",result)
		this.setState({loading:false})
		if (result.status===0) {
			if (parentId==='0') {
				const categories = result.data
				this.setState({
					categories
				})
			}
			else {
				const subCategories = result.data
				this.setState({
					subCategories
				})
			}
		}
		else {
			message.error("get category failed")
		}
	}

	showMainCategories = () => {
    // 更新为显示一列表的状态
    this.setState({
      parentId: '0',
      parentName: '',
      subCategorys: []
    })
  }
	showModal = (status) => {
	    this.setState({
	      showStatus: status,
	    });
	}

	handleCancel =() => {
		this.setState({showStatus: 0})
		this.form.resetFields()
	}

	addCategory = () => {
		this.form.validateFields(async (err, values) => {
			if (!err) {
				const {parentId, categoryName} = values
				const result = await reqAddCategory(categoryName, parentId)
				if(result.status===0) {
					if(parentId===this.state.parentId) {
						this.getCategories()
					} else if (parentId==='0'){
					this.getCategories('0')
					}
				}
				this.handleCancel()
			}
		})
	}

	showUpdateCategory = (category) => {
		this.showModal(2)
		this.setState({
			updatedItem:category
		})
	}

	updateCategory = async () => {
		const categoryId = this.state.updatedItem._id
		this.form.validateFields(async (err, values) => {
			if(!err) {
		      	const categoryName=this.form.getFieldValue('categoryName')
				const result = await reqUpdateCategory({categoryId,categoryName})
				console.log(result)
				if (result.status===0) {
					this.getCategories()
				}
				this.handleCancel()
			}
		})
	}

	componentDidMount() {
		this.getCategories()
		console.log(this)
	}
	render() {
		const {categories,loading,showStatus,subCategories,parentId,parentName,updatedItem} = this.state
		const title = (!parentName)?"Main":
		(
			<span>
				<Button type="link" onClick={this.showMainCategories} style={{fontWeight: 500,fontSize:"16px",paddingLeft:0,paddingRight:0}}>Main</Button>
				<Icon type='arrow-right' style={{marginRight: 5}}/>
        		<span>{parentName}</span>
			</span>
		)
		const extra = (
			<Button type="primary" onClick={()=>{this.showModal(1)}}><Icon type='plus'/>Add</Button>
		)
		return (
			<div>
			<Card title={title} extra={extra}>
				 <Table
				 	dataSource={parentId==='0'? categories:subCategories}
				 	columns={this.columns}
				 	bordered
				 	loading={loading}
				 	rowKey='_id'
				 	pagination={{defaultPageSize:2, showQuickJumper:true}}
				 />
				 <Modal
		          title="Add"
		          visible={showStatus===1}
		          onOk={this.addCategory}
          		  onCancel={this.handleCancel}
		        >
		          <AddForm 
		          	categories={categories}
		          	parentId={parentId}
		          	setForm={(form)=>{this.form=form}}
		          />
		        </Modal>
				 <Modal
		          title="Update"
		          visible={showStatus===2}
		          onOk={this.updateCategory}
          		  onCancel={this.handleCancel}
		        >
		          <UpdateForm categoryName={updatedItem}
		           setForm = {(form)=>{this.form=form}}
		           />
		        </Modal>		        
			</Card>
			</div>
		)
	}
}