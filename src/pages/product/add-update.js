import React, {Component} from 'react'
import {
	Card,
	Form,
	Icon,
	Input,
	Select,
	Button,
	Cascader,
	message
} from 'antd'
import {reqCategories,reqAddOrUpdateProduct} from '../../api'
import PictureWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'

const Item = Form.Item
const Option = Select.Option
const { TextArea } = Input
const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 8 },
}

class ProductAddUpdate extends Component {
	constructor(props){
        super(props)
		this.isUpdate = this.props.location.state?true:false
		this.product = this.props.location.state || {}
		this.editor = React.createRef()
    }
	
	state = {
		options:[],
		pictureList:[]||this.product.imgs,
	}

	handleSubmit = () => {
	    this.props.form.validateFields(async (err, values) => {
	      if (!err) {
		    const {name, desc, price, categoryIds} = values
		    //get values then make product
	        let pCategoryId, categoryId
	        if (categoryIds.length===1) {
	          pCategoryId = '0'
	          categoryId = categoryIds[0]
	        } else {
	          pCategoryId = categoryIds[0]
	          categoryId = categoryIds[1]
	        }
	        const imgs = this.product.imgs
			const detail = this.editor.current.getDetail()
			const product = {name, desc, price, pCategoryId, categoryId,detail,imgs}
			//update->adding new id
			if(this.isUpdate) {
	          product._id = this.product._id
	        }
	        //post data to backend
			const result = await reqAddOrUpdateProduct(product)
			//show results
			if (result.status===0) {
	          message.success(`${this.isUpdate ? 'update' : 'add'} success!`)
	          this.props.history.goBack()
	        } else {
	          message.error(`${this.isUpdate ? 'update' : 'add'} faild!`)
	        }
	      }
	      else {
	      	console.log("validation faild")
	      }
	    })
 	}

	validatePrice = (rule, value, callback) => {
		if (value*1<0)
			callback("price should be greater than 0")
		else {
			callback()
		}
	}

   loadData = async selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1]
    targetOption.loading = true
    // load options lazily
    const subCategories = await this.getCategories(targetOption.value)
    targetOption.loading = false
    if (subCategories && subCategories.length>0) {
	    const childOptions = subCategories.map(c => ({
	        value: c._id,
	        label: c.name,
	        isLeaf: true
	      }))
	    targetOption.children = childOptions
	}
	else {
		targetOption.isLeaf = true
	}
      this.setState({
        options: [...this.state.options],
      })
  }

	initOptions =  async (categories) => {
	    const options = categories.map(c => ({
	      value: c._id,
	      label: c.name,
	      isLeaf: false,  
	    }))
	    const {isUpdate} = this
	    const {pCategoryId} = this.product
	    if(isUpdate&&pCategoryId!=='0') {
    		const subCategories = await this.getCategories(pCategoryId)
		    if (subCategories && subCategories.length>0) {
			    const childOptions = subCategories.map(c => ({
			        value: c._id,
			        label: c.name,
			        isLeaf: true
			      }))
				const targetOption = options.find(option => option.value===pCategoryId)
			    targetOption.children = childOptions
			}
	    }
	    this.setState({
			options
		})
	}

  getCategories = async (parentId) => {
		const result = await reqCategories(parentId)
		if (result.status===0) {
			const categories = result.data
			if (parentId==='0') {
				this.initOptions(categories)
			}
			else {
				//subcategories
				return categories
			}
		}
		else {
			message.error("get category failed")
		}
	}

	pictureListGet = (e) => {
		this.setState({
			pictureList: e
		})
		this.product.imgs = this.state.pictureList
	}
	componentDidMount () {
	    this.getCategories('0')
	  }

	render() {
	    const {isUpdate, product} = this
	    const {name,price,desc,pCategoryId, categoryId, imgs, detail} = product
		const {categories} = this.state
		const { getFieldDecorator } = this.props.form;
		const categoryIds = []
		if (this.isUpdate) {
			if(pCategoryId==='0') {
		        categoryIds.push(categoryId)
			} else {
				categoryIds.push(pCategoryId)
		        categoryIds.push(categoryId)
			}
		}
		const title = (
			<span>
			<Icon
            type='arrow-left'
            style={{marginRight: 10}}
            onClick={() => this.props.history.goBack()}
          />
          <span>{this.props.location.state?"Update product":"Add new product"}</span>
          </span>
          )
		return (
		<Card title={title} className="product-add-update">
			<Form {...layout}>
				<Item label="Name">
				{getFieldDecorator('name', {
		          initialValue:name,
				  rules: [
	                {required: true, message: 'have to input category name'}
	              ]
		          })(
		          	<Input placeholder="please input product name"/>
				)}
				</Item>
				<Item label="Description">
				{getFieldDecorator('desc', {
		          initialValue:desc,
				  rules: [
	                {required: true, message: 'have to input category description'}
	              ]
		          })(
		          	<TextArea placeholder="Please input product description" autoSize={{ minRows: 2, maxRows: 6 }}/>
				)}
				</Item>
				<Item label="Price">
				{getFieldDecorator('price', {
		          initialValue:price,
				  rules: [
	                {required: true, 
					 validator: this.validatePrice
	                }
	              ]
		          })(
		          	<Input type='number' placeholder="Please input price" addonBefore= "$"/>
				)}
				</Item>
				<Item label="Category">
				{getFieldDecorator('categoryIds', {
                initialValue: categoryIds,
				  rules: [
	                {
	                	required: true, 
	                }
	              ]
		          })(
				 <Cascader
			        options={this.state.options}
			        loadData={this.loadData}
			      />
			      )}
				</Item>
				<Item label="Pictures">
					<PictureWall pictureListGet={this.pictureListGet} pictureList={imgs}/>
				</Item>
				<Item label='Text' labelCol={{span: 2}} wrapperCol={{span: 20}}>
					<RichTextEditor ref={this.editor} detail={detail}/>
				</Item>
				<Item>
	            <Button type='primary' onClick={this.handleSubmit}>Submit</Button>
	          </Item>
			</Form>
		</Card>
		)
	}
}

export default Form.create()(ProductAddUpdate)